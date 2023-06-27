const { contentType } = require('mime-types');
const DBClient = require('../utils/db');
const UtilController = require('./UtilController');

class FilesController {
  static async postUpload(req, res) {
    const userId = req.user.id;
    const {
      name, type, parentId, isPublic, data,
    } = req.body;

    // Check for missing required fields or invalid combinations
    if (!name || !type || (!['folder', 'file', 'image'].includes(type)) || (!data && type !== 'folder')) {
      res.status(400).send(`error: ${!name ? 'Missing name' : (!type || (!['folder', 'file', 'image'].includes(type)))
        ? 'Missing type' : 'Missing data'}`);
    } else {
      try {
        let flag = false;
        if (parentId) {
          // Check if parent exists and is a folder
          const folder = await DBClient.db
            .collection('files')
            .findOne({ _id: parentId });
          if (!folder) {
            res.status(400).json({ error: 'Parent not found' }).end();
            flag = true;
          } else if (folder.type !== 'folder') {
            res.status(400).json({ error: 'Parent is not a folder' }).end();
            flag = true;
          }
        }
        if (!flag) {
          // Insert new file into the database
          const insRes = await DBClient.db
            .collection('files')
            .insertOne({
              userId,
              name,
              type,
              isPublic,
              parentId,
              data,
            });
          const docs = insRes.ops[0];
          delete docs.localPath;
          docs.id = docs._id;
          delete docs._id;
          res.status(201).json(docs).end();
        }
      } catch (err) {
        res.status(400).json({ error: err.message }).end();
      }
    }
  }

  static async getShow(req, res) {
    const usrId = req.user._id;
    const { id } = req.params;

    // Retrieve file from the database
    const file = await DBClient.db
      .collection('files')
      .findOne({ _id: id });

    if (!file || String(file.userId) !== String(usrId)) {
      // File not found or unauthorized access
      res.status(404).json({ error: 'Not found' }).end();
    } else {
      res.status(200).json(file).end();
    }
  }

  static async getIndex(req, res) {
    const usrId = req.user._id;
    const parentId = req.query.parentId || '0';
    const page = req.query.page || 0;

    // Retrieve files based on user, parent, and pagination
    const cursor = await DBClient.db
      .collection('files')
      .find(
        { parentId, userId: usrId },
        { limit: 20, skip: 20 * page },
      );

    const results = await cursor.toArray();
    const files = results.map((i) => {
      i.id = i._id;
      delete i._id;
      return i;
    });

    res.status(200).json(files).end();
  }

  static async putPublish(req, res) {
    const userId = req.user._id;

    // Check if file exists and belongs to the user
    const file = await DBClient.db
      .collection('files')
      .findOne({ _id: req.params.id });

    if (!file || String(file.userId) !== String(userId)) {
      res.status(404).json({ error: 'Not found' }).end();
    } else {
      // Update file to make it public
      const newFile = await DBClient.db
        .collection('files')
        .updateOne({ _id: file._id }, { $set: { isPublic: true } });

      res.status(200).json(newFile).end();
    }
  }

  static async putUnpublish(req, res) {
    const userId = req.user._id;

    // Check if file exists and belongs to the user
    const file = await DBClient.db
      .collection('files')
      .findOne({ _id: req.params.id });

    if (!file || String(file.userId) !== String(userId)) {
      res.status(404).json({ error: 'Not found' }).end();
    } else {
      // Update file to make it private
      const newFile = await DBClient.db
        .collection('files')
        .updateOne({ _id: file._id }, { $set: { isPublic: false } });

      res.status(200).json(newFile).end();
    }
  }

  static async getFile(req, res) {
    const usrId = req.user._id;

    // Retrieve file from the database
    const file = await DBClient.db
      .collection('files')
      .findOne({ _id: req.params.id });

    if (!file) {
      // File not found
      res.status(404).json({ error: 'Not found' }).end();
    } else if (file.type === 'folder') {
      // Cannot download a folder
      res.status(400).json({ error: "A folder doesn't have content" }).end();
    } else if (String(file.userId) === String(usrId) || file.isPublic) {
      try {
        // Read and send the file content
        const content = await UtilController.readFile(file.localPath);
        const header = { 'Content-Type': contentType(file.name) };
        res.set(header).status(200).send(content).end();
      } catch (err) {
        // File content not found
        res.status(404).json({ error: 'Not found' }).end();
      }
    } else {
      // Unauthorized access
      res.status(404).json({ error: 'Not found' }).end();
    }
  }
}

module.exports = FilesController;

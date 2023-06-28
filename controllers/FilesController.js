const { contentType } = require('mime-types');
const dbClient = require('../utils/db');
const UtilController = require('./UtilController');

class FilesController {
  // Handles file upload by creating a new file record in the database.
  static async postUpload(request, response) {
    const userId = request.user.id;
    const {
      name, type, parentId, isPublic, data,
    } = request.body;

    let errorMessage;

    if (!name) {
      errorMessage = 'Missing name';
    } else if (!type || !['folder', 'file', 'image'].includes(type)) {
      errorMessage = 'Missing type';
    } else if (!data && type !== 'folder') {
      errorMessage = 'Missing data';
    }

    if (errorMessage) {
      // Missing name, type, or data
      response.status(400).json({ error: errorMessage }).end();
    } else {
      try {
        let flag = false;
        if (parentId) {
          // Check if parent exists and is a folder
          const folder = await dbClient.filterFiles({ _id: parentId });

          if (!folder) {
            // Parent not found
            response.status(400).json({ error: 'Parent not found' }).end();
            flag = true;
          } else if (folder.type !== 'folder') {
            // Parent is not a folder
            response.status(400).json({ error: 'Parent is not a folder' }).end();
            flag = true;
          }
        }

        if (!flag) {
          // Create a new file
          const insRes = await dbClient.newFile(userId, name, type, isPublic, parentId, data);
          const docs = insRes.ops[0];
          delete docs.localPath;
          docs.id = docs._id;
          delete docs._id;
          response.status(201).json(docs).end();
        }
      } catch (err) {
        // Error creating file
        response.status(400).json({ error: err.message }).end();
      }
    }
  }

  // Retrieves the file information based on the provided file ID.
  static async getShow(request, response) {
    const usrId = request.user._id;
    const { id } = request.params;
    const file = await dbClient.filterFiles({ _id: id });

    if (!file || String(file.userId) !== String(usrId)) {
      // File not found or unauthorized
      response.status(404).json({ error: 'Not found' }).end();
    } else {
      // Return file
      response.status(200).json(file).end();
    }
  }

  // Retrieves a list of files based on the provided parent ID and user ID.
  static async getIndex(request, response) {
    const usrId = request.user._id;
    let _parentId = '0';
    let page = 0;

    if (request.query.parentId) {
      _parentId = request.query.parentId;
    }

    if (request.query.page) {
      page = request.query.page;
    }

    const cursor = await dbClient.findFiles(
      { parentId: _parentId, userId: usrId },
      { limit: 20, skip: 20 * page },
    );

    const res = await cursor.toArray();

    // Update the IDs and remove _id properties from each item in the result
    const transformedRes = res.map((item) => {
      const { _id, ...rest } = item;
      return { id: _id, ...rest };
    });

    // Return files
    response.status(200).json(transformedRes).end();
  }

  // Publishes a file by updating its isPublic property to true.
  static async putPublish(request, response) {
    const userId = request.usr._id;
    const file = await dbClient.filterFiles({ _id: request.params.id });

    if (!file || String(file.userId) !== String(userId)) {
      // File not found or unauthorized
      response.status(404).json({ error: 'Not found' }).end();
    } else {
      // Publish file
      const newFile = await dbClient.updateFiles({ _id: file._id }, { isPublic: true });
      response.status(200).json(newFile).end();
    }
  }

  // Unpublishes a file by updating its isPublic property to false.
  static async putUnpublish(request, response) {
    const userId = request.usr._id;
    const file = await dbClient.filterFiles({ _id: request.params.id });

    if (!file || String(file.userId) !== String(userId)) {
      // File not found or unauthorized
      response.status(404).json({ error: 'Not found' }).end();
    } else {
      // Unpublish file
      const newFile = await dbClient.updateFiles({ _id: file._id }, { isPublic: false });
      response.status(200).json(newFile).end();
    }
  }

  // Retrieves the content of a file for download.
  static async getFile(request, response) {
    const usrId = request.usr._id;
    const file = await dbClient.filterFiles({ _id: request.params.id });

    if (!file) {
      // File not found
      response.status(404).json({ error: 'Not found' }).end();
    } else if (file.type === 'folder') {
      // Folders don't have content
      response.status(400).json({ error: "A folder doesn't have content" }).end();
    } else if (String(file.userId) === String(usrId) || file.isPublic) {
      try {
        // Read file content and send response
        const content = await UtilController.readFile(file.localPath);
        const header = { 'Content-Type': contentType(file.name) };
        response.set(header).status(200).send(content).end();
      } catch (err) {
        // Error reading file
        response.status(404).json({ error: 'Not found' }).end();
      }
    } else {
      // Unauthorized to access file
      response.status(404).json({ error: 'Not found' }).end();
    }
  }
}

module.exports = FilesController;

'use-strict';

const CamerasController = require('./cameras.controller');

const PaginationMiddleware = require('../../middlewares/pagination.middleware');
const PermissionMiddleware = require('../../middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../../middlewares/auth.validation.middleware');
const CamerasValidationMiddleware = require('../../middlewares/cameras.validation.middleware');

/**
 * @swagger
 * tags:
 *  name: Cameras
 */

exports.routesConfig = (app) => {
  /**
   * @swagger
   * /api/cameras:
   *   get:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Get all cameras
   *     parameters:
   *       - in: query
   *         name: cameras
   *         description: Cameras
   *         example: "Camera One,Camera Two"
   *         type: string
   *       - in: query
   *         name: status
   *         description: Status
   *         example: "Online,Offline"
   *         type: string
   *       - in: query
   *         name: start
   *         type: number
   *         description: Start index
   *       - in: query
   *         name: page
   *         type: number
   *         description: Page
   *       - in: query
   *         name: pageSize
   *         type: number
   *         description: Page size
   *     responses:
   *       200:
   *         description: Successfull
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.get('/api/cameras', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:access'),
    CamerasController.list,
    PaginationMiddleware.pages,
  ]);

  /**
   * @swagger
   * /api/cameras:
   *   post:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Creates new camera
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              videoConfig:
   *                type: object
   *                properties:
   *                  source:
   *                    type: string
   *     responses:
   *       201:
   *         description: Successfull
   *       401:
   *         description: Unauthorized
   *       409:
   *         description: Camera already exists
   *       500:
   *         description: Internal server error
   */
  app.post('/api/cameras', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:edit'),
    CamerasValidationMiddleware.hasValidFields,
    CamerasController.insert,
  ]);

  /**
   * @swagger
   * /api/cameras:
   *   delete:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Remove all cameras from config/ui
   *     responses:
   *       204:
   *         description: Successfull
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.delete('/api/cameras', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:edit'),
    CamerasController.removeAll,
  ]);

  /**
   * @swagger
   * /api/cameras/{name}:
   *   get:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Get specific camera by name
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Name of the camera
   *     responses:
   *       200:
   *         description: Successfull
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  app.get('/api/cameras/:name', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:access'),
    CamerasController.getByName,
  ]);

  /**
   * @swagger
   * /api/cameras/{name}:
   *   patch:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Change camera config by name
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Name of the camera
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            type: object
   *     responses:
   *       200:
   *         description: Successfull
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  app.patch('/api/cameras/:name', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:edit'),
    CamerasController.patchByName,
  ]);

  /**
   * @swagger
   * /api/cameras/{name}:
   *   delete:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Delete camera by name
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Name of the camera
   *     responses:
   *       200:
   *         description: Successfull
   *       400:
   *         description: Bad request
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  app.delete('/api/cameras/:name', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:edit'),
    CamerasController.removeByName,
  ]);

  /**
   * @swagger
   * /api/cameras/{name}/snapshot:
   *   get:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Get camera snapshot by name
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Name of the camera
   *       - in: query
   *         name: buffer
   *         schema:
   *           type: boolean
   *         description: Returns a buffer of the snapshot
   *     responses:
   *       200:
   *         description: Successfull
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  app.get('/api/cameras/:name/snapshot', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:access'),
    CamerasController.getSnapshotByName,
  ]);

  /**
   * @swagger
   * /api/cameras/{name}/status:
   *   get:
   *     tags: [Cameras]
   *     security:
   *       - bearerAuth: []
   *     summary: Get camera status by name
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Name of the camera
   *     responses:
   *       200:
   *         description: Successfull
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   *       500:
   *         description: Internal server error
   */
  app.get('/api/cameras/:name/status', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired('cameras:access'),
    CamerasController.getStatusByName,
  ]);
};

import express from 'express';
import controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';
const router = express.Router();

// import controllers

router.route('/signup').post(controller.UserController.createUser);
router.route('/update-profile').post(controller.UserController.updateProfile);
router.route('/login').post(controller.UserController.userLogin);
router.route('/update').patch(isAuthenticated,controller.UserController.updateUserById);
router.route('/forgot-password').post(controller.UserController.forgotPassword);
router.route('/getAllUsers').get(isAuthenticated,hasAdminAccess,controller.UserController.getAllUsers);
router.route('/search').get(isAuthenticated,hasAdminAccess,controller.UserController.searchUsers);
router.route('/:userId').get(isAuthenticated,controller.UserController.getUserById);
router.route('/delete').delete(isAuthenticated,hasAdminAccess,controller.UserController.deleteUser)

export default router;

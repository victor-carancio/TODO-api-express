const Task = require("../models/taskModel.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllTasks = async (req, res, next) => {
  const task = await Task.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ task, count: task.length });
};

const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await Task.findOne({ _id: taskId, createdBy: userId });
  if (!task) {
    throw new NotFoundError(`No found task with id ${taskId}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

const createTask = async (req, res, next) => {
  req.body.createdBy = req.user.userId;

  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
};

const updateTask = async (req, res, next) => {
  const {
    body: { task },
    user: { userId },
    params: { id: taskId },
  } = req;

  if (task === "") {
    throw new BadRequestError("Task field cannot be empty");
  }

  const taskUpdate = await Task.findByIdAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!taskUpdate) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }

  res.status(StatusCodes.OK).json({ taskUpdate });
};

const deleteTask = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  const task = await Task.findByIdAndRemove({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

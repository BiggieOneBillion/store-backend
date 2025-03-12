const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const { storeService } = require("./index");
const { uploadImage } = require("../storage/cloudinary.service");

// Store Controllers
const createStore = catchAsync(async (req, res) => {
  console.log(req.files);

  const store = await storeService.createStore({
    ...req.body,
    owner: req.user.id,
  });
  res.status(httpStatus.CREATED).send(store);
});

const getStores = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "status", "owner", "categories"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await storeService.queryStores(filter, options);
  res.send(result);
});

const getStore = catchAsync(async (req, res) => {
  const store = await storeService.getStoreByOwnerId(req.params.userId);

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store not found");
  }
  res.send(store);
});

const updateStore = catchAsync(async (req, res) => {
  if (req.files) {
    const upload = await uploadImage(req.files.logo.tempFilePath);
    if (!upload) {
      throw new ApiError(httpStatus[503], "Image Upload Down");
    }
    const body = { ...req.body, logo: upload.secure_url };
    const store = await storeService.updateStoreById(req.params.userId, body);
    res.send(store);
    return;
  }
  const store = await storeService.updateStoreById(req.params.userId, req.body);
  res.send(store);
});

const deleteStore = catchAsync(async (req, res) => {
  await storeService.deleteStoreById(req.params.storeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
};

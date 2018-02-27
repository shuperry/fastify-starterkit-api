import StoreGlobalDataUtil from '../utils/store-global-data-util'

export default async (fastify) => {
  await StoreGlobalDataUtil.storeGloabalCategories(fastify)
}

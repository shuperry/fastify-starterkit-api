/**
 * Created by perry on 2017/4/13.
 */

export const transaction = (target, key, descriptor) => {
  const fn = descriptor.value

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@transaction can only be used on functions, not: ${fn}`)
  }

  descriptor.value = async (...args) => {
    return fastify.sequelize.transaction(async t1 => {
      return await fn.apply(target, args)
    })
  }

  return descriptor
}

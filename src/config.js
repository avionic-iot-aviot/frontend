export default {
  tenantId: process.env.NODE_ENV === 'production'
    ? undefined
    : 'agri'
}

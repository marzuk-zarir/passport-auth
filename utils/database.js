const { connect } = require('mongoose')

exports.connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log('🔥 Database connection established')
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

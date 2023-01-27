import mongoose from 'mongoose'

const avisSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

}, {
    timestamps: true
})

const Avis = mongoose.model('Avis', avisSchema)

export default Avis
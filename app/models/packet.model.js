module.exports = mongoose => {
    const schema = mongoose.Schema({
        packet_id: String,
        packet_name: String,
        packet_price: Number,
        schedule: String,
        schedule_description: String,
        course_list: [String],
    })

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Packet = mongoose.model("packets", schema)

    return Packet
}
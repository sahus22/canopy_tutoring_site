// sets the year, month, and day of the dest_datetime to match that of the source_datetime
function sync_date(source_datetime, dest_datetime){
    dest_datetime.setFullYear(source_datetime.getFullYear())
    dest_datetime.setMonth(source_datetime.getMonth())
    dest_datetime.setDate(source_datetime.getDate())
}

module.exports = {
    sync_date
}
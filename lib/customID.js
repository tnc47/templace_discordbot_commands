
RegisID = (key, name, data) => {
    return `${key}_${name}-${JSON.stringify(data)}`
}

parseCustomData = (customId) => {
    const m = customId.match(/\[(.*?)\]/);
    if (!m) return [];
    try {
        // m[0] มีวงเล็บเหลี่ยมอยู่แล้ว เช่น ["sendID","modalID"]
        const arr = JSON.parse(m[0]);
        // กันกรณี nested เช่น [["modalID"]]
        return Array.isArray(arr) && Array.isArray(arr[0]) ? arr[0] : arr;
    } catch {
        return [];
    }
}
module.exports = { RegisID, parseCustomData };
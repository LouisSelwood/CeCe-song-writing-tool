
export function getProjectNameFromFilePath(filePath){
    const files = filePath.split('\\')
    const file = files.at(-1)
    const fileName = file.split('.').at(0)
    console.log(fileName)
    return fileName
    
}
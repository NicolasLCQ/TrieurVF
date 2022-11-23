const fs = require('fs')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const findCountryByCoordinate = require("country-locator")
// const pLimit = require('p-limit');
// const limit = pLimit(3);
// const createLimiter = require('limit-async')
// const limitAsync = createLimiter(1);
const ep = new exiftool.ExiftoolProcess(exiftoolBin)

const __SOURCE_DIRECTORY__ = 'N:/Photos/'
const __DESTINATION_DIRECTORY__ = 'N:/TRIE/'

const RecupInfoFromFile = async (_FILE_PATH_) => {
    await ep.open()
    try {
        const MDRes = await ep.readMetadata(_FILE_PATH_, ['-File:all'])
        await ep.close()
        if (MDRes.error) {
            return {
                SourceFile: "@[error]",
                GPSPosition: "@[error]",
                CreateDate: "@[error]"
            }
        } else {
            return {
                SourceFile: MDRes.data[0]?.SourceFile,
                GPSPosition: MDRes.data[0]?.GPSPosition,
                CreateDate: MDRes.data[0]?.CreateDate
            }
        }
    } catch (error) {
        console.log(error)
        await ep.close()
    }

}

// const ScanDir = async (DIR) => {
//     const res = []

//     fs.readdir()
// }
const SendFileToPath = (file_name, dest_path, dest_name) => {
    try {
        fs.mkdirSync(dest_path, { recursive: true })
        fs.copyFileSync(file_name, dest_path + dest_name)
        // console.log(`COPY ${file_name} to ${dest_path}`)
    } catch (creation_error) {
        console.log('[ERROR - CREATION-DOSSIER]', creation_error)
    }
}

const main = async (SRC_DIR, DST_DIR) => {
    //await Promise.all(
    fs.readdir(SRC_DIR, async (err, files) => {
        if (err) {
            console.log('[READING_DIR - ERROR]', err)
        } else {
            let count = 0
            for (const file of files) {
                console.log(count + ' / ' + files.length)
                console.log(file)

                const METADATA = await RecupInfoFromFile(SRC_DIR + file)

                var destination_finale = DST_DIR;

                if (METADATA.CreateDate == "@[error]") {
                    destination_finale = destination_finale + "@[ERROR]/"
                } else {
                    if (METADATA.CreateDate) {
                        destination_finale = destination_finale + METADATA.CreateDate?.toString().split(':')[0] + '/'
                    }
                    else destination_finale = destination_finale + '@NoDate' + '/'
                    if (METADATA.GPSPosition) {
                        const lat = METADATA.GPSPosition?.toString().split(',')[0].slice(0, 2)
                        const lng = METADATA.GPSPosition?.toString().split(',')[1].slice(0, 2)
                        const country = findCountryByCoordinate.findCountryByCoordinate(Number(lat), Number(lng))
                        destination_finale = destination_finale + country?.name + '/'
                    }
                    else destination_finale = destination_finale + 'NoPosition' + '/'
                }

                SendFileToPath(METADATA.SourceFile, destination_finale, file)

                count = count + 1;
                // console.clear()
            }
        }

    })

    //)

}

try {

} catch (error) {
    console.log(error)
}
main(__SOURCE_DIRECTORY__, __DESTINATION_DIRECTORY__)










// ep
//     .open()
//     //.then(() => console.clear())
//     .then(() => console.log('------------------------------------------'))
//     .then(() => console.log('-----------------STARTING-----------------'))
//     .then(() => console.log('------------------------------------------'))
//     .then(() => {
//         fs.readdir(_SOURCE_DIRECTORY_, (err, files) => {
//             if (err) {
//                 console.log(err)
//             } else {
//                 files.forEach(file => {
//                     ep.readMetadata(file, ['-File:all'])
//                         .then(() => {
//                             if (RES.error) console.log(RES.error)
//                             else {
//                                 console.log(`${RES.data[0].SourceFile}  ==>  ${_DESTINATION_DIRECTORY_}/${RES.data[0].CreateDate}/${RES.data[0].GPSPosition}`)
//                             }
//                         })
//                 })
//             }
//         })
//     })


//     // .then(() => ep.readMetadata('ccc.jpg', ['-File:all'])
//     //     .then((RES) => {
//     //         if (RES.error) console.log(RES.error)
//     //         else console.log(
//     //             {
//     //                 SourceFile: RES.data[0].SourceFile,
//     //                 GPSPosition: RES.data[0].GPSPosition,
//     //                 CreateDate: RES.data[0].CreateDate
//     //             })
//     //     }

//     //     )
//     // )

//     .then(() => ep.close())
//     .then(() => console.log('------------------------------------------'))
//     .then(() => console.log('------------------ENDING------------------'))
//     .then(() => console.log('------------------------------------------'))
//     .catch('[ERROR]', console.error)


        // fs.readdir(_DESTINATION_DIRECTORY_, (err, files) => {
        //     if (err) {
        //         // if (err.code == 'ENOENT') {
        //         //     try {
        //         //         fs.mkdirSync(_DESTINATION_DIRECTORY_, { recursive: true })
        //         //     } catch (creation_error) {
        //         //         console.log('[ERROR - CREATION-DOSSIER]', creation_error)
        //         //     }
        //         // }
        //         // else {
        //         console.log(err)
        //         // }
        //     }
        //     else files.forEach(file => console.log(file))
        // })
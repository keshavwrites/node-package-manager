#!/usr/bin/env node

let fs = require("fs");
let path = require("path");

let inputArr = process.argv.slice(2);
//console.log(inputArr);

//node main.js tree "directory path"
//node main.js organise "dirrectory path"
//ndoe main.js help

let command = inputArr[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xslv', 'xls', 'odt', 'ods', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', 'deb']
};


switch (command) {

    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("please 🙏 input right commmand");
        break;

}


function treeFn(directorypath) {
    //console.log("Tree command implemented for", directorypath);
    let destPath;
    if (directorypath == undefined) {
         process.cwd();
        return;
    } else {
        let doesExist = fs.existsSync(directorypath);
        if (doesExist) {
            //2. create -> organised files->directory
            treeHelper( process.cwd(),"");

        } else {
            console.log("kindly enter the path");
            return;
        }
    }
}

function treeHelper(dirpath,indent) {
    //isfile or folder
    let isFile=fs.lstatSync(dirpath).isFile();
    if(isFile){
        let fileName = path.basename(dirpath);
        console.log(indent +"|----"+fileName);
    }else{
        let dirName=path.basename(dirpath);
        console.log(indent +"<--"+dirName);
        let children = fs.readdirSync(dirpath);
        for(let i=0;i<children.length;i++){
         let childpath=path.join( dirpath,children[i]);
            treeHelper(childpath,indent+"\t");
        }

    }
}


function organizeFn(directorypath) {
    // console.log("Organize command implemented for",directorypath);
    //1. input ->directory ka path given hoga uske andar jaake create karnahoga
    // organised files ke naam ki direcctory
    let destPath;
    if (directorypath == undefined) {
        destPath = process.cwd();
        return;
    } else {
        let doesExist = fs.existsSync(directorypath);
        if (doesExist) {
            //2. create -> organised files->directory
            destPath = path.join(directorypath, "organised_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }

        } else {
            console.log("kindly enter the path");
            return;
        }
    }

    organizeHelper(directorypath, destPath);




    //5.  

}


function organizeHelper(src, dest) {
    //3. identify categories of all the files present in that input directory->
    let childNames = fs.readdirSync(src);
    console.log(childNames);

    for (let i = 0; i < childNames.length; i++) {
        let address = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(address).isFile();
        if (isFile) {
            //console.log(childNames[i]);
            //4. cop/cut files to that organised directory inside of any category folder
            let category = getCategory(childNames[i]);
            //console.log(childNames[i],"belongs to ",category);
            sendFiles(address, dest, category);

        }
    }

}


function sendFiles(srcFilePath, dest, category) {
    let categorypath = path.join(dest, category);
    if (!fs.existsSync(categorypath)) {
        fs.mkdirSync(categorypath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categorypath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    console.log(fileName, "copied to", category);

}

//help implemented
function helpFn() {
    console.log(`
        List of all the commands:
        node main.js tree "directoryPath"
        node main.js organize "directorypath"
        node main.js help
    `);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArr = types[type];
        for (let i = 0; i < cTypeArr.length; i++) {
            if (ext == cTypeArr[i]) {
                return type;
            }
        }
    }
    return "others";

}
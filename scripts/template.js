/**
 * pages页面快速生成脚本 ，路径不能以/开头
 * 用法：npm run tep `文件路径`
 * author: jiemo
 * date: 2018.11.9 
 */

const fs = require('fs');

const dirName = process.argv[2];
let fileName = dirName;
let preDirStr = "";
let dirLevel = "";
if (dirName.includes("/")) {
    for (let i = 0; i < dirName.split("/").length - 1; i++) {
        dirLevel += "../";
    }
    preDirStr = dirName.substring(0, dirName.lastIndexOf("/"));
    fileName = dirName.substring(dirName.lastIndexOf("/") + 1);
}
console.log("preDirStr:" + preDirStr);
console.log("fileName:" + fileName);
console.log("dirLevel:" + dirLevel);

const capPirName = fileName.substring(0, 1).toUpperCase() + fileName.substring(1);
if (!dirName) {
    console.log('文件夹名称不能为空！');
    console.log('示例：npm run tep test');
    process.exit(0);
}

//页面模板
const indexTep = `import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { ${capPirName}Props, ${capPirName}State } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ ${fileName} }) => ({
//     ...${fileName},
// }))

class ${capPirName} extends Component<${capPirName}Props,${capPirName}State > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ${capPirName}Props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='${fileName}-wrap'>
            
        </View>
        )
    }
}

export default ${capPirName}
`

// scss文件模版
const scssTep = `
.${fileName}-wrap {
    width: 100%;
    min-height: 100vh;
}
`

//model模板

const modelTep = `// import Taro from '@tarojs/taro';
// import * as ${fileName}Api from './service';

export default {
    namespace: '${fileName}',
    state: {
    },

    effects: {},

    reducers: {}

}
`

const interfaceTep = `/**
 * ${fileName}.state 参数类型
 *
 * @export
 * @interface ${capPirName}State
 */
export interface ${capPirName}State {}

/**
 * ${fileName}.props 参数类型
 *
 * @export
 * @interface ${capPirName}Props
 */
export interface ${capPirName}Props {}
`

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`index.tsx`, indexTep); //tsx
fs.writeFileSync(`index.scss`, scssTep); // scss
fs.writeFileSync('model.ts', modelTep); // model
fs.writeFileSync(`index.interface.ts`, interfaceTep); // interface
process.exit(0);
const { build } = require('esbuild')
const {resolve} = require('path')

const args = require('minimist')(process.argv.slice(2))
// minimist 用来解析命令行参数

const target = args._[0] || 'reactivity'
const format = args.f || 'global'

// 开发环境只打包一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

/* 
    iife 立即执行函数           (funcion(){})()
    cjs node中的模块            module.exports
    esm 浏览器中的esModule模块   import
*/
const outPutFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outFile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

// 支持ts
build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile: outFile,
    bundle: true, // 把所有的包打包到一起
    sourcemap: true,
    format: outPutFormat, // 输出的格式
    globalName: pkg.buildOptions?.name, // 打包的全局名字
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {
        // 监控文件变化
        onRebuild(error){
            if(!error) console.log(`rebuilt~~~~~`)
        }
    }
}).then(()=>{
    console.log('watch~~~~~');
})
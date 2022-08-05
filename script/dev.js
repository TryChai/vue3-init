const args = require('minimist')(process.argv.slice(2))
// minimist 可以解析参数
const path = require('path')

const target = args._[0] || 'reactivity'

const format = args.f || 'global'

const entry = path.resolve(__dirname,`../packages/${target}/src/index.ts`)

const packageName = require(path.resolve(__dirname,`../packages/${target}/package.json`)).buildOptions?.name


// iife 自执行函数 global  增加全局变量
// cjs commonjs 规范
// esm es6Module

const outFormat = format.startsWith('global') ? 'iife' :format === 'cjs' ? 'cjs':'esm'

const outfile = path.resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`)

const {build} = require('esbuild')

build({
    entryPoints:[entry],
    outfile,
    bundle:true,
    sourcemap:true,
    format:outFormat,
    globalName:packageName,
    platform:format === 'cjs' ?'node':'browser',
    watch:{
        onRebuild(error){
            if(!error) console.log('rebuild~~~')
        }
    }
}).then(()=>{
    console.log('watch~~~')
})


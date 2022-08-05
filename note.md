-npm 的特点  bootstrap -> animate.css 不用重新animate.css(幽灵依赖) 大部分人喜欢这种方式

pnpm 会将所有的依赖都放入 node_modules 下面的.pnpm 文件夹下 

在.npmrc 文件加这行 sharefully-hoist = true 可以实现将pnpm 的依赖转成npm 的方式
羞耻模式 将依赖拍平 到nodes_modules
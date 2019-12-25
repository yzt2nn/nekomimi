# nekomimi
基于Deno的一个监听代码修改并自动重启项目的工具。

### 参数配置
在config.ts中配置参数

| 参数 | 说明 |
|  ----  | ----  |
| rootDir  | 项目的根目录，nekomimi会以此为顶级目录查找文件。 |
| exts  | 指定要查找文件的扩展名。 |
| excludeDir | 排除的目录，例如["/.git"]。 |
| cmd | 每次检测到改动后执行的命令。 |
| autoRun | 是否在启动nekomimi后马上执行一次命令。 |
| checkInterval | 检查改动的时间间隔，默认500毫秒。 |
| reloadDelay | 重新加载的延迟时间，防止短时间内多次修改保存造成的重复加载。 |

### 执行
1、 确保已经安装了Deno，Deno的安装参照[官网](https://deno.land/)

2、 进入nekomimi根目录，执行 deno --allow-run nekomimi.ts

如果提示权限不足，请尝试在前面加上sudo，如：sudo deno --allow-run nekomimi.ts

# DEPLOY CHECKLIST

1. 把 templates 和 regex 推到 GitHub 仓库。
2. 创建 tag（例：v1.0.0）并推送。
3. 将 regex 文件里的 templateUrl 中 <YOUR_GH_USER>/<YOUR_REPO>/<TAG> 替换成真实值。
4. 在酒馆导入 regex JSON，启用该条目。
5. 实测：名字、正文、头像、mood 切换、手机端显示。
6. 回归：开启/关闭 reduced motion，检查动画降级。

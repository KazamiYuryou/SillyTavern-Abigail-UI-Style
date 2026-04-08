# 线上清单版结构

## 目录
- templates/abby-galaxy-dialog-v1.html
- regex/regex-命定核心-阿比盖尔美化-线上外链版-v1.json
- docs/DEPLOY_CHECKLIST.md

## 发布规则
1. 每次发布打 tag（例如 v1.0.0），JSON 中 templateUrl 指向 tag，不要直接指向 main。
2. 修改模板后递增版本（v1 -> v2），避免缓存导致线上旧样式。
3. 若头像仓库迁移，统一只改 portraitUrl 基址。

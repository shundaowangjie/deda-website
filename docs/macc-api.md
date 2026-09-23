# 51macc 商用车配件数据接口(接入测试记录)

> 2026-09-23 实测四接口全通。密钥:`.env.local` 的 `MACC_USERID`。
> **额度仅剩 199 次**(frequency 字段),公开接入必须充值+强缓存。

## 端点速查

统一:POST `https://www.51macc.com/api/Mattrio/CvApi/{方法}`,
Content-Type: application/x-www-form-urlencoded,参数带 `userid`(即密钥)。

| 方法 | 用途 | 关键参数 | 返回要点 |
|---|---|---|---|
| GetSerial | VIN→车型档案 | userid, vin | modelId/modelName/brandName/factory/publicCode/type(轻卡重卡)/year/description |
| GetGroupss | 三级分组树 | userid, vin, publicCode, carId, groupId(一级传9999) | groupName + **英/俄翻译** + groupId + hasChild |
| GetBom | 配件查询 | userid + (vin\|carId\|publicCode三选一) + groupId/itemId(OE)/itemName/brandId/page(每页20) | OE号/标准名/别名/**英俄名**/SVG图/用量/brandId |
| getItemPrice | OE价格 | userid, itemid(OE) | 厂价/售价/零售价 + **售后供应商现货报价(含电话)** |

## 实测样例(2026-09-23)

- VIN `LFWSRXSJ8HAB00616` → 解放 2017 重卡,一汽解放汽车有限公司 ✓
- 一级分组:其它辅料/动力总成/变速箱总成/底盘总成…(带俄语"Силовой агрегат"等)✓
- itemName=刹车片 → OE `3502386BA2T` 制动蹄片用滚轮,别名"制动片,摩擦片,后片,刹车片,后刹车片",SVG 图床地址,俄语"Тормозная колодка задней оси" ✓
- OE `1703080-T0102` → 东风操纵手柄 厂价151.59 + 十堰多家供应商 55~128 元现货报价含电话 ✓

## 状态码

0 成功;-1 无数据;-2 密钥错;-3 当天次数用完;-4/-10 限流;-11 VIN非法;-13 品牌未覆盖;-999 封禁

## 接入策略(定稿)

1. **内部工具先行**(额度小,不公开):客服"VIN查件"页——报VIN→车型→分组→OE清单→拿OE回自己 11834 款库匹配报价;getItemPrice 做采购比价
2. **充值后再公开**:公开"按VIN找件"入口必须带 Supabase 缓存(同 VIN 全链路只耗 1 次额度)
3. **数据沉淀**:接口返回的 OE/别名/三语名称可持续回填自有库(互换号+俄语名增强)

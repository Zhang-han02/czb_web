/* eslint-disable */
import { hiprint } from 'vue-plugin-hiprint'

// 自定义设计元素1
export const billProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("billProvider");
    context.addPrintElementTypes(
      "billProvider",
      [
        new hiprint.PrintElementTypeGroup("单据", [
          {
            tid: 'billProvider.header', title: '单据表头', field: 'header',  type: 'text',
            options: {
              testData:'xx通知单',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          { tid: 'billProvider.billDate', title: '日期', field: 'billDate', data: '年-月-日', type: 'text' },
          { tid: 'billProvider.billNum', title: '单据号', field: 'billNum', data: 'xxxxx', type: 'text' },
          { tid: 'billProvider.transactionCompany', title: '往来单位名称', field: 'transactionCompany', data: 'xxxxx', type: 'text' },
          { tid: 'billProvider.warehouse', title: '仓库', field: 'warehouseName', data: 'xxxxx', type: 'text' },
          {
            tid: 'aProviderModule.detail', title: '单据详细清单',
            field: 'detail',
            type: 'table',
            options: {
              tableHeaderRepeat: 'first',
              tableFooterRepeat: 'last',
              fields: [
                { text: '序号', field: 'serialNumber' },
                { text: '产品编号', field: 'prodNum' },
                { text: '产品名称', field: 'prodName' },
                { text: '磅台名称', field: 'poundName' },
                { text: '磅单编号', field: 'poundBillNum' },
                { text: '单位', field: 'unit' },
                { text: '重量', field: 'weight' },

              ],
            },
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                { title: '序号', align: 'center', field: 'serialNumber', width: 80},
                { title: '产品名称', align: 'center', field: 'prodName', width: 150 },
                { title: '产品编号', align: 'center', field: 'prodNum', width: 80 },
                { title: '磅台名称', align: 'center', field: 'poundName', width: 80 },
                { title: '磅单编号', align: 'center', field: 'poundBillNum', width: 100 },
                { title: '单位', align: 'center', field: 'unit', width: 100 },
                { title: '重量', align: 'center', field: 'weight', width: 100 },
              ],
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data && data['totalWeight']) {
                return `<td style="padding:0 10px" colspan="100">${'重量小计: ' + data['totalWeight']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">重量小计: </td>'
            },
          },
        ]),

      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// 自定义设计元素2
export const bProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("bProviderModule");
    context.addPrintElementTypes(
      "bProviderModule",
      [
        new hiprint.PrintElementTypeGroup("常规", [
          {
            tid: 'bProviderModule.header', title: '单据表头', data: '单据表头', type: 'text',
            options: {
              testData: '单据表头',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'bProviderModule.type', title: '单据类型', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'bProviderModule.order', title: '订单编号', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.date', title: '业务日期', data: '2020-01-01', type: 'text',
            options: {
              field: 'date',
              testData: '2020-01-01',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.barcode', title: '条形码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "barcode"
            }
          },
          {
            tid: 'bProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "qrcode"
            }
          },
          {
            tid: 'bProviderModule.platform', title: '平台名称', data: '平台名称', type: 'text',
            options: {
              testData: '平台名称',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          { tid: 'bProviderModule.image', title: 'Logo', data: '', type: 'image' },
        ]),
        new hiprint.PrintElementTypeGroup("客户", [
          {
            tid: 'bProviderModule.khname', title: '客户名称', data: '高级客户', type: 'text',
            options: {
              field: 'name',
              testData: '高级客户',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.tel', title: '客户电话', data: '18888888888', type: 'text',
            options: {
              field: 'tel',
              testData: '18888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
        ]),
        new hiprint.PrintElementTypeGroup("表格/其他", [
          {
            tid: 'bProviderModule.table', title: '订单数据',
            type: 'tableCustom',
            options: {
              field: 'table',
              fields: [
                { text: '名称', field: 'NAME' },
                { text: '数量', field: 'SL' },
                { text: '规格', field: 'GG' },
                { text: '条码', field: 'TM' },
                { text: '单价', field: 'DJ' },
                { text: '金额', field: 'JE' },
                { text: '备注', field: 'DETAIL' },
              ],
            },
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            columns: [
              [
                { title: '名称', align: 'center', field: 'NAME', width: 100 },
                { title: '数量', align: 'center', field: 'SL', width: 100 },
                { title: '条码', align: 'center', field: 'TM', width: 100 },
                { title: '规格', align: 'center', field: 'GG', width: 100 },
                { title: '单价', align: 'center', field: 'DJ', width: 100 },
                { title: '金额', align: 'center', field: 'JE', width: 100 },
                { title: '备注', align: 'center', field: 'DETAIL', width: 100 },
              ]
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data && data['totalCap']) {
                return `<td style="padding:0 10px" colspan="100">${'应收金额大写: ' + data['totalCap']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
            },
          },
          { tid: 'bProviderModule.customText', title: '文本', customText: '自定义文本', custom: true, type: 'text' }
        ]),
        new hiprint.PrintElementTypeGroup("辅助", [
          {
            tid: 'bProviderModule.hline',
            title: '横线',
            type: 'hline'
          },
          {
            tid: 'bProviderModule.vline',
            title: '竖线',
            type: 'vline'
          },
          {
            tid: 'bProviderModule.rect',
            title: '矩形',
            type: 'rect'
          },
          {
            tid: 'bProviderModule.oval',
            title: '椭圆',
            type: 'oval'
          }
        ])
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// type: 1单据 2经销商
export default [{
  name: '单据',
  value: 'billProvider',
  type: 1,
  f: billProvider()
}, {
  name: 'B设计',
  value: 'bProviderModule',
  type: 2,
  f: bProvider()
}]

import { list as classTreeLIst } from '@/api/czb/classTree'
import { hiprint, defaultElementTypeProvider as DefaultElementTypeProvider } from 'vue-plugin-hiprint'
import { detail } from '@/api/system/printTemplate'
import providers from '@/views/system/print/providers'

export function loadClassTree(type) {
  function buildTree(tree) {
    tree.forEach(data => {
      if (data.children) {
        buildTree(data.children)
      }
      if (data.children.length === 0) {
        delete data.children
      }
    })
  }
  return classTreeLIst({ enabled: true, type: type }).then((res) => {
    const data = res.content
    buildTree(data)

    return data
  })
}

export function getAllTreeNodes(item) {
  const nodes = [item.id]
  getChildrenNode(nodes, item.children)
  return nodes
}
function getChildrenNode(nodes, childrens) {
  if (childrens && childrens.length !== 0) {
    childrens.forEach(val => {
      nodes.push(val.id)
      getChildrenNode(nodes, val.children)
    })
  }
}
/**
 * 通过自定义模板打印
 * @param {*} printData 打印数据
 */
export function templatePrint(printData, tenplateKey = '1') {
  return new Promise((resolve, reject) => {
    detail({ key: tenplateKey }).then((result) => {
      if (!result.id) {
        reject({ message: '请先设置模板，再进行打印' })
        return
      }
      hiprint.init({
        providers: [providers[0].f, new DefaultElementTypeProvider()]
      })
      const printTemplate = new hiprint.PrintTemplate({
        template: JSON.parse(result.content)
      })
      printTemplate.print(printData, {}, {
        callback: () => {
          resolve()
        }
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

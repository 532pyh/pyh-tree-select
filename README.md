#### el-select-tree组件使用说明
##### 安装
```
npm install fxft-tree-select -s
````
#### 使用
```
import treeSelect from 'fxft-tree-select';
Vue.use(treeSelect);
```
##### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | -------- | -------- | -------- | -------- |
| value / v-model     | 绑定值    | string/number/array     | —     | —     |
| disabled     | 是否禁用    | boolean     | —     | false     |
| size     | 输入框尺寸    | string     | medium/small/mini    | mini     |
| clearable     | 是否可以清空选项    | boolean     | —    | false     |
| placeholder     | 占位符    | string     | —    | 请选择     |
| filterable     | 是否可搜索    | boolean     | —    | false     |
| popper-append-to-body     | 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false    | boolean     | --    | false     |
| data     | 展示数据    | array     | —    | —     |
| node-key     | 用于设置绑定值属性    | String     | —    | id     |
| props     | 配置选项，具体看下表    | object     | —    | —     |
| default-expand-all | 是否默认展开所有节点   | boolean     | —    | false     |
| default-expanded-keys  | 默认展开的节点的 key 的数组    | array     | —    | —     |
| show-checkbox  | 显示复选框，即多选    | 节点是否可被选择     | —    | false     |
| check-strictly     | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法（不相关联：父的选择影响子，子的选择不影响父），默认为 false    | boolean     | —    | false     |

##### props
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | -------- | -------- | -------- | -------- |
| label | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | — | text |
| children | 指定子树为节点对象的某个属性值 | string | — | children |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | boolean, function(data, node) | — | disabled |
| pid | 当check-strictly值为true时,必须指定当前数据对象的父级id | string | — | pid |

##### 方法
| 方法名 | 说明 | 参数 |
| -------- | -------- | -------- |
| getCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组 | — |
| getCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组 | — |
| getCurrentKey | show-checkbox为false,获取当前被选中节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null | — |
| getCurrentNode | show-checkbox为false,获取当前被选中节点的 data，若没有节点被选中则返回 null | — |

##### Events
| 事件名称 | 说明 | 回调参数 |
| -------- | -------- | -------- |
| node-click | 节点被点击时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 | 

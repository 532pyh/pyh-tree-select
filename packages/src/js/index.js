const mapById = {};
export default {
    name: 'treeSelect',
    props: {
        checkHalf: {
            type: Boolean,
            default: false,
        },
        /*select属性*/
        value: {
            required: true
        },
        clearable: Boolean,
        placeholder: {
            type: String,
            default: '请选择'
        },
        size: {
            type: String,
            default: 'mini'
        },
        filterable: Boolean,
        popperAppendToBody: Boolean,
        disabled: {
            type:Boolean,
            default:false,
        },

        /*tree属性*/
        nodeKey: {
            type: String,
            default: 'id'
        },
        checkStrictly: Boolean,
        data: {
            type: Array
        },
        props: {
            default() {
                return {
                };
            }
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        defaultExpandAll: Boolean,
        defaultExpandedKeys: Array
    },
    data() {
        return {
            label: this.showCheckbox ? [] : '', //select-绑定值
            expandOnClickNode: this.showCheckbox, //tree-是否在点击节点的时候展开或者收缩节点
            multiple: this.showCheckbox, //select-是否多选
            collapseTags: this.showCheckbox, //select-多选时是否将选中值按文字的形式展示
            highlightCurrent: !this.showCheckbox, //tree-是否高亮当前选中节点
            mergeProps: {
                children: 'children',
                label: 'label',
                disabled: 'disabled',
                pid: 'pid', //父级ID
            },
        }
    },
    watch: {
        value: {
            deep: true,
            handler(newValue, oldValue) {
                let newValueClone = [], oldValueClone = [];
                const toString = Object.prototype.toString;
                const clone = function (array) {
                    return JSON.parse(JSON.stringify(array));
                };

                if (toString.apply(newValue) == "[object Array]") {
                    newValueClone = clone(newValue);
                    newValueClone.sort();
                }

                if (toString.apply(oldValue) == "[object Array]") {
                    oldValueClone = clone(oldValue);
                    oldValueClone.sort();
                }

                if ((toString.apply(newValue) == "[object Array]" && newValueClone.toString() != oldValueClone.toString()) ||
                    (toString.apply(newValue) != "[object Array]" && newValue != oldValue)) {
                    if (this.showCheckbox) {
                        this.setCheckedKeys(newValue, false, false);
                    } else {
                        this.setCurrentKey(this.isEmpty(newValue) ? null : newValue, false);
                    }
                }
            }
        },
        data: {
            deep: true,
            handler(data) {
                if (!this.isEmpty(this.value)) {
                    if (this.showCheckbox) {
                        this.setCheckedKeys(this.value, false, false);
                    } else {
                        this.setCurrentKey(this.isEmpty(this.value) ? null : this.value, false);
                    }
                }
            }
        },
        multiple(boolean) {
            if (boolean) this.label = [];
        },
        showCheckbox(boolean) {
            this.expandOnClickNode = this.multiple = this.collapseTags = boolean;
            this.highlightCurrent = !boolean;
            this.label = boolean ? [] : '';
        },
    },
    created() {
        this.mergeProps = Object.assign({}, this.mergeProps, this.props);
        this.mapDataById(this.data);
    },
    methods: {
        mapDataById(data) {
            data.forEach(item => {
                mapById[item.id] = item;
                if (item[this.mergeProps.children]) {
                    this.mapDataById(item[this.mergeProps.children])
                }
            })
        },
        isEmpty(value) {
            return value === '' || value === null || value === undefined;
        },

        /**
         * 可清空的单选模式下用户点击清空按钮时触发
         */
        selectClearAll() {
            this.$emit('input', this.showCheckbox ? [] : '');
            if (!this.multiple) {
                this.$refs.tree.setCurrentKey(null);
            } else {
                this.$refs.tree.setCheckedKeys([]);
            }
        },

        /**
         * 多选模式下移除tag时触发
         * @param tag   移除的tag值
         */
        selectRemoveTag(tag) {
            const self = this;
            let data = this.$refs.tree.getCheckedNodes();
            let checkedIds = this.$refs.tree.getCheckedKeys();
            let keys = [];

            //复选框时，checkStrictly:true时父节点的选择影响子节点，子节点的选择不影响父节点;false=父子互相关联
            if (this.checkStrictly) {
                //不关联
                data.forEach(item => {
                    if (item[this.mergeProps.label] != tag) {
                        keys.push(item[this.nodeKey]);
                    }
                });
            } else {
                //关联
                let tagId, tagPid; //删除项的id和父级id
                let removeIds = []; //要删除的id

                //获取当前删除项的id和父级id
                for (let item of data) {
                    if (item[this.mergeProps.label] == tag) {
                        tagId = item[this.nodeKey];
                        tagPid = item[this.mergeProps.pid];
                        break;
                    }
                }
                //获取过滤的子级id
                let getChildrenIds = function (data) {
                    let ids = [];
                    data.forEach(item => {
                        ids.push(item[self.nodeKey]);
                        if (Array.isArray(item[self.mergeProps.children]) && item[self.mergeProps.children].length) {
                            ids = ids.concat(getChildrenIds(item[self.mergeProps.children]));
                        }
                    });
                    return ids;
                };

                //获取过滤的父级id
                let getParentIds = function (data, pid) {
                    let ids = [];
                    for (let item of data) {
                        if (item[self.nodeKey] == pid) {
                            ids.push(item[self.nodeKey]);
                            ids = ids.concat(getParentIds(data, item[self.mergeProps.pid]));
                            break;
                        }
                    }
                    return ids;
                };

                //获取不满足的id
                for (let item of data) {
                    if (item[this.nodeKey] == tagId) {
                        removeIds.push(item[this.nodeKey]); //当前项过滤

                        //获取过滤的子级id
                        if (Array.isArray(item[this.mergeProps.children]) && item[this.mergeProps.children].length) {
                            removeIds = removeIds.concat(getChildrenIds(item[this.mergeProps.children]));
                        }

                        //获取过滤的父级id
                        removeIds = removeIds.concat(getParentIds(data, tagPid));
                        break;
                    }
                }
                keys = checkedIds.filter(id => !removeIds.includes(id));

                //显示文本信息处理
                let labels = [];
                data.forEach(item => {
                    if (keys.includes(item[this.nodeKey])) {
                        labels.push(item[this.mergeProps.label]);
                    }
                });
                this.label = labels;
            }
            this.$refs.tree.setCheckedKeys(keys);
            this.$emit('input', keys);
        },

        /**
         * 下拉框出现/隐藏时触发
         * 出现则为 true，隐藏则为 false
         * @param bool
         */
        selectVisibleChange(bool) {
            if (!bool) this.dataRestore();
        },

        /**
         * 搜索
         * @param query
         */
        selectFilterMethod(query = '') {
            this.$refs.tree.filter(query);
        },

        /**
         * 数据还原
         */
        dataRestore() {
            if (this.filterable) {
                this.selectFilterMethod();
            }
        },

        /**
         * 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
         */
        treeFilterNode(value, data, node) {
            if (!value) return true;
            return data[this.mergeProps.label].indexOf(value) !== -1;
        },

        /**
         * 节点被点击时的回调
         * 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
         * @param data
         * @param node
         * @param component
         */
        treeNodeClick(data, node, component) {
            if (this.showCheckbox) { //多选

            } else { //单选
                this.label = node.label;
                this.$refs.selectTree.blur();
                this.$emit('input', node.key);
                this.$emit('node-click', data, node, component);
            }
        },

        /**
         * 当复选框被点击的时候触发
         *共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，
         * 包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
         */
        treeCheck(data, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
            if (this.checkStrictly) { //父子不相关联
                //当前节点是否选中
                const checked = checkedKeys.includes(data[this.nodeKey]);
                let checkedArray = [], //当前树的选择节点id
                    currendChidenIds = []; //当前节点子节点id数组
                let checkedLabelArray = []; //当前树的选择节点名称
                //获取子树id
                let getIds = array => {
                    let checkedIds = [];
                    if (Array.isArray(array) && array.length) {
                        for (let item of array) {
                            checkedIds.push(item[this.nodeKey]);
                            if (Array.isArray(item[this.mergeProps.children]) && item[this.mergeProps.children].length) {
                                checkedIds = checkedIds.concat(getIds(item[this.mergeProps.children]));
                            }
                        }
                    }
                    return checkedIds;
                };

                //获取父节点id
                let getParentIds = data => {
                    let checkedIds = [];
                    if (data[this.mergeProps.pid]) {
                        checkedIds.push(data[this.mergeProps.pid]);
                        if(mapById[data[this.mergeProps.pid]]){
                            checkedIds = checkedIds.concat(getParentIds(mapById[data[this.mergeProps.pid]]));
                        }
                    }
                    return checkedIds
                };

                if (Array.isArray(data[this.mergeProps.children]) && data[this.mergeProps.children].length) {
                    currendChidenIds = getIds(data[this.mergeProps.children]);
                    //获取树的选中id(不包含当前子节点id)
                    for (let id of checkedKeys) {
                        if (!currendChidenIds.includes(id)) {
                            checkedArray.push(id);
                        }
                    }

                    //当前节点选中，加入当前子节点id
                    if (checked) {
                        checkedArray = checkedArray.concat(currendChidenIds);
                    }

                    //将子节点所有关联的父节点都选中直到顶部
                    if (this.checkHalf) {
                        checkedArray = checkedArray.concat(getParentIds(data));
                    }

                    this.setCheckedKeys(checkedArray);
                }
                else {
                    //将子节点所有关联的父节点都选中直到顶部
                    if (this.checkHalf) {
                        checkedArray = getParentIds(data);
                        const keys=checkedNodes.map(item => item[this.nodeKey]);
                        checkedArray = checkedArray.concat(keys);
                        this.setCheckedKeys(checkedArray);
                    } else {
                        this.label = checkedNodes.map(item => item[this.mergeProps.label]);
                        this.$emit('input', checkedNodes.map(item => item[this.nodeKey]));
                    }
                }

            } else {
                this.label = checkedNodes.map(item => item[this.mergeProps.label]);
                this.$emit('input', checkedNodes.map(item => item[this.nodeKey]));
            }
        },

        /**
         * 当前选中节点变化时触发的事件
         * @param data 当前节点的数据
         * @param node 前节点的 Node 对象
         */
        treeCurrentChange(data, node) {

        },

        /**
         * 节点选中状态发生变化时的回调
         * @param data 传递给 data 属性的数组中该节点所对应的对象
         * @param checked 节点本身是否被选中
         * @param childChecked 节点的子树中是否有被选中的节点
         */
        treeCheckChange(data, checked, childChecked) {
        },

        /**
         * 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
         */
        getCheckedNodes() {
            if (this.showCheckbox)
                return this.$refs.tree.getCheckedNodes();
            
        },

        /**
         * 设置目前勾选的节点，使用此方法必须设置 node-key 属性
         * @param nodes 接收勾选节点数据的数组
         */
        setCheckedNodes(nodes) {
            if (this.showCheckbox)
                this.$refs.tree.setCheckedNodes(nodes);
        },

        /**
         * 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
         */
        getCheckedKeys() {
            if (this.showCheckbox)
                return this.$refs.tree.getCheckedKeys();
        },

        /**
         * 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
         * (keys, leafOnly) 接收两个参数
         * @param keys 勾选节点的 key 的数组
         * @param leafOnly boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
         * @param emit 是否触发input事件
         */
        setCheckedKeys(keys, leafOnly = false, emit = true) {
            this.$nextTick(() => {
                if (this.showCheckbox) {
                    this.$refs.tree.setCheckedKeys(keys, leafOnly);
                    const nodes = this.$refs.tree.getCheckedNodes();
                    this.label = nodes.map(item => item[this.mergeProps.label]);
                    if (emit) {
                        this.$emit('input', nodes.map(item => item[this.nodeKey]));
                    }
                }
            });
        },

        /**
         * 获取当前被选中节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null
         */
        getCurrentKey() {
            return this.$refs.tree.getCurrentKey();
        },

        /**
         * 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
         * @param key  待被选节点的 key，若为 null 则取消当前高亮的节点
         * @param emit 是否触发input事件
         */
        setCurrentKey(key, emit = true) {
            this.$nextTick(() => {
                if (key === null && this.$refs.tree.getCurrentKey() === null) return;
                this.$refs.tree.setCurrentKey(key);
                const node = this.$refs.tree.getCurrentNode();
                if (node) {
                    this.label = node[this.mergeProps.label];
                    if (emit) {
                        this.$emit('input', node[this.nodeKey]);
                    }
                } else {
                    this.label = '';
                }
            });
        },

        /**
         * 获取当前被选中节点的 data，若没有节点被选中则返回 null
         */
        getCurrentNode() {
            return this.$refs.tree.getCurrentNode();
        },

        /**
         * 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
         * @param node 待被选节点的 node
         */
        setCurrentNode(node) {
            this.$refs.tree.setCurrentNode(node);
        }
    }
}

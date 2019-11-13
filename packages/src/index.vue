<template>
    <el-select ref="selectTree" v-model="label" :disabled="disabled" :placeholder="placeholder" :size="size" :clearable="clearable" :multiple="multiple" :collapse-tags="collapseTags" :filterable="filterable" :filter-method="selectFilterMethod" :popper-append-to-body="popperAppendToBody" @clear="selectClearAll" @visible-change="selectVisibleChange" @remove-tag="selectRemoveTag">
        <el-option v-show="false" value="1"></el-option>
        <el-tree ref="tree" :node-key="nodeKey" :show-checkbox="showCheckbox" :expand-on-click-node="expandOnClickNode" :data="data" :props="props" :check-strictly="checkStrictly" :highlight-current="highlightCurrent" :default-expand-all="defaultExpandAll" :default-expanded-keys="defaultExpandedKeys" @node-click="treeNodeClick" @check="treeCheck" @current-change="treeCurrentChange" @check-change="treeCheckChange" :filter-node-method="treeFilterNode">
        </el-tree>
    </el-select>
</template>

<script src="./js/index.js"></script>

<style scoped lang="less">
/deep/ .el-tree__empty-block {
    min-height: 25px;
}
</style>

<template>
    <div style="text-align:center">
        <img alt="Vue logo" src="../assets/logo.png">
        <div>
            <tree-select style="width:300px;" check-strictly checkHalf :data="data" v-model="val" :props="props" default-expand-all filterable popper-append-to-body ref="treeSelect"></tree-select>
        </div>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            props: {
                label: 'title',
            },
            data: [
                {
                    title: "我的账户",
                    id: 869,
                    pid: 868,
                    children: [
                        {
                            id: 877,
                            pid: 869,
                            title: "账户概览",
                            children: [
                                {
                                    id: 878,
                                    pid: 877,
                                    title: "账户提现(账户信息)",
                                    disabled: true
                                }
                            ]
                        }
                    ]
                },
            ],
            val: []
        }
    },
    methods: {
    }
};
</script>

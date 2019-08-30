<template>
    <div style="text-align:center">
        <img alt="Vue logo" src="../assets/logo.png">
        <div>
            <tree-select style="width:300px;" check-strictly :data="data" v-model="val" :props="props" show-checkbox default-expand-all filterable popper-append-to-body></tree-select>
        </div>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            props: {
                label: 'label',
            },
            data: [
                {
                    label: "一级 1",
                    id: 1,
                    pid: 0,
                    children: [
                        {
                            label: "二级 1-1",
                            id: 2,
                            pid: 1,
                            children: [
                                {
                                    label: "三级 1-1-1",
                                    id: 3,
                                    pid: 3,
                                }
                            ]
                        }
                    ]
                },
                {
                    label: "一级 2",
                    id: 4,
                    children: [
                        {
                            label: "二级 2-1",
                            id: 5,
                            children: [
                                {
                                    label: "三级 2-1-1",
                                    id: 6
                                }
                            ]
                        },
                        {
                            label: "二级 2-2",
                            id: 7,
                            children: [
                                {
                                    label: "三级 2-2-1",
                                    id: 8
                                }
                            ]
                        }
                    ]
                },
                {
                    label: "一级 3",
                    id: 9,
                    children: [
                        {
                            label: "二级 3-1",
                            id: 10,
                            children: [
                                {
                                    label: "三级 3-1-1",
                                    id: 11
                                }
                            ]
                        },
                        {
                            label: "二级 3-2",
                            id: 12,
                            children: [
                                {
                                    label: "三级 3-2-1",
                                    id: 13
                                }
                            ]
                        }
                    ]
                }
            ],
            val: []
        }
    }
};
</script>

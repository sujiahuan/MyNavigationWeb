<template>
    <a-list
            class="demo-loadmore-list"
            :loading="loading"
            item-layout="horizontal"
            :data-source="data"
    >
        <a-list-item slot="renderItem" slot-scope="item">
            <a slot="actions">edit</a>
            <a slot="actions">more</a>
            <a-list-item-meta
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            >
                <a slot="title" href="https://www.antdv.com/">{{ item.name.last }}</a>
                <a-avatar
                        slot="avatar"
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
            </a-list-item-meta>
            <div>content</div>
        </a-list-item>
    </a-list>
</template>
<script>
    // import reqwest from 'reqwest';

    // const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

    export default {
        data() {
            return {
                loading: true,
                // loadingMore: false,
                // showLoadingMore: true,
                data: [],
            };
        },
        mounted() {
        },
        methods: {
        },
    };
</script>
<style>
    .demo-loadmore-list {
        min-height: 350px;
    }
</style>

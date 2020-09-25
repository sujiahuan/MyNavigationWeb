const bookmark={
    getBookmarkList(data){
        return this.$axios.get(this.$base.api+'/bookmark/getBookmark',{params:data})
    },
    DeleteBookmark(data){
        return this.$axios.delete(this.$base.api+'/bookmark/deleteById',{params:data})
    },
    getBookmark(data){
        return this.$axios.get(this.$base.api+'/bookmark/getById',{params:data})
    },
    addBookmark(data){
        return this.$axios.post(this.$base.api+'/bookmark/add',data)
    },
    editBookmark(data){
        return this.$axios.post(this.$base.api+'/bookmark/update',data)
    }
}

export default bookmark;
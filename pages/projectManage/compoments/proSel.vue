<template>
  <view class="bidSel">
    <easy-select ref="easySelect2" size="mini" class="easySelect" :value="proName" @selectOne="selectOne" :options="proList"></easy-select>
    <easy-select ref="easySelect2" size="mini" class="easySelect" :value="bidName" @selectOne="selectOne2" :options="bidList"></easy-select>
  </view>
</template>

<script>
export default {
    data(){
        return{
            proName:"全部",
            proList:[],
            proId:"",
            bidName:"全部",
            bidList:[],
            bidId:""
        }
    },
    mounted(){
        this.searchProject()
    },
    methods:{
        searchProject(){
          this.$api.searchProject().then(res=>{
            if(res.code===200){
              this.proList=[{label:"全部",value:""},...res.data.map(item=>({...item,value:item.pkId,label:item.projectName}))]
            }else{
              uni.showToast({ title: res.msg, icon:'none' })
            }
          })
        },
        projectBidByProjectId(){
            this.$api.projectBidByProjectId({projectId:this.proId}).then(res=>{
                if(res.code===200){
                  this.bidList=[{label:"全部",value:""},...res.data.map(item=>({...item,value:item.pkId,label:item.projectName}))]
                }else{
                  uni.showToast({ title: res.msg, icon:'none' })
                }
            })
        },
        selectOne(e){
            if(this.proId == e.options.value) return
            this.proName = e.options.label;
            this.proId = e.options.value;
            this.bidName="全部"
            this.bidId=""
            let data ={
                projectId:this.proId,
                projectBidId:""
            }
            if(this.proId){
                this.projectBidByProjectId()
            }else{
                this.bidList=[{label:"全部",value:""}]
            }
            this.$emit("change",data)
        },
        selectOne2(e){
            if(this.bidId == e.options.value) return
            this.bidName = e.options.label;
            this.bidId = e.options.value;
            let data ={
                projectId:this.proId,
                projectBidId:this.bidId
            }
            this.$emit("change",data)
        },
    }
}
</script>

<style lang="scss" scoped>
.bidSel{
    display: flex;
    background-color: #fff;
    padding: 10rpx 30rpx;
    .easySelect{
        flex: 1;
    }
}
</style>
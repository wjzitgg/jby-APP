import request from "./request";
const api = {
	// 登录
	imgCode: (data = {}) => request.get("/code", data), //图形验证码
	pdfToImage: (data = {}) => request.get("/app/public/pdfToImage", data), //pdf转图片
	available: (data = {}) => request.get("/auth/account/available", data), //查询账号是否已有人引用
	getHomeNotice: (data = {}) =>
		request.get("/app/oaNotice/getHomeNotice", data), //查询首页公告
	getAuthStatus: (data = {}) => request.get("/auth/getAuthStatus", data), //获取实名状态-通用
	updateQRCode: (data = {}) => request.get("/app/public/updateQRCode", data), //根据唯一标识修改二维码的扫码状态为已扫码
	getApproveStatus: (data = {}) =>
		request.get("/app/public/getApproveStatus", data), //获取审批流程启用核身状态 0:不认证 1:核身认证 2:签名 3:核身并签名
	mobileMsg: (data = {}) => request.post("/auth/send/verification/code", data), //获取手机短信
	userLogin: (data = {}) => request.post("/auth/app/sysLogin", data), //登录
	register: (data = {}) => request.post("/auth/app/register", data), //注册
	updateStatusByScanCode: (data = {}) =>
		request.put(
			`/app/scanCode/updateStatusByScanCode?scanCode=${data.scanCode}&loginStatus=${data.loginStatus}`,
			data
		), //根据扫码登陆唯一标识修改扫码状态
	resetPassword: (data = {}) => request.post("/auth/app/reset/password", data), //APP端-修改账号密码
	getAccountList: (data = {}) => request.get("/auth/findUserByTelephone", data), //根据手机号获取账号列表
	findUserByTelephone: (data = {}) =>
		request.get("/operation/login/findUserByTelephone", data), //根据手机号获取账号列表(不需要code和uuid)
	findUnsubscribeUserByTelephone: (data = {}) =>
		request.get("/app/user/findUnsubscribeUserByTelephone", data), //根据手机号获取注销账号列表
	judgeBusinessSuccess: (data = {}, token) =>
		request.get("/app/public/judgeBusinessSuccess", data, token), //根据业务ID判断业务是否成功
	logOut: (data = {}) => request.deleter("/auth/app/sysLogout", data), //退出登陆-APP
	selectOrgByProjectId: (data = {}) =>
		request.get("/app/org/selectOrgByProjectId", data), //根据项目查询分包商信息
	selectSelfInfo: (data = {}) =>
		request.get("/app/labourTeamMembersInsure/selectSelfInfo", data), //查询自己的保险信息
	findConById: (data = {}) => request.get("/app/labourContract/findById", data), //根据ID查询合同
	getContractList: (data = {}) =>
		request.get("/app/labourContract/getContractList", data), //查询当前登录人的已签合同
	getNotSignedContractList: (data = {}) =>
		request.get("/app/labourNotSignedContract/getNotSignedContractList", data), //查询当前登录人的待签合同
	getObsoleteContractList: (data = {}) =>
		request.get("/app/labourNotSignedContract/getObsoleteContractList", data), //查询当前登录人的过期合同
	selectTrain: (data = {}) => request.get("/app/labourTrain/searchPage", data), //查询自己的培训信息
	getGrantInfo: (data = {}) =>
		request.get("/app/labourSettlement/getGrantInfo", data), //查看发放信息
	getSettlementInfo: (data = {}) =>
		request.get("/app/labourSettlement/searchPage", data), //查看结算信息
	getSettlementInfotwo: (data = {}) =>
		request.get("/app/labourSettlement/getSettlementInfo", data), //查看结算信息
	getSurplusInfo: (data = {}) =>
		request.get("/app/labourSettlement/searchBalance", data), //查看结余信息
	getOftenRouter: (data = {}) => request.get("/app/menu/getOftenRouters", data), //获取移动端路由和菜单
	setOftenRouter: (data = {}) =>
		request.put("/app/menu/oftenMenu?memuIds=" + data.memuIds, data), //设置常用功能
	getAppRouter: (data = {}) => request.get("/app/menu/getAppRouter", data), //获取移动端路由和菜单
	getProjects: (data = {}) => request.get("/app/user/getProjects", data), //获取所有任职过的项目
	getWorkExpList: (data = {}) => request.get("/app/user/getWorkExpList", data), //获取个人工作经历
	getInfo: (data = {}) => request.get("/app/user/info", data), //获取个人信息
	modifyPhoto: (data = {}) =>
		request.post("/app/user/modifyPhoto?url=" + data.url, data), //修改头像
	addTeamMembers: (data = {}) =>
		request.post("/app/labourTeamMembers/addTeamMembers", data), //新增班组成员
	addTeamSettlement: (data = {}) =>
		request.post("/app/labourTeamMembers/addTeamSettlement", data), //新增班组结算
	getTeamGrantInfo: (data = {}) =>
		request.get("/app/labourTeamMembers/getTeamGrantInfo", data), //查看班组发放信息
	getTeamMembersInfo: (data = {}) =>
		request.get("/app/labourTeamMembers/getTeamMembersInfo", data), //查看组内人员信息
	getTeamSettlementInfo: (data = {}) =>
		request.get("/app/labourTeamMembers/getTeamSettlementInfo", data), //查看班组结算信息
	selectByOrgId: (data = {}) =>
		request.get("/app/labourTeamMembers/selectByOrgId", data), //根据企业查询班组
	getWait: (data = {}) => request.get("/app/user/getWait", data), //获取待办事项(培训)
	getDoneTaskDetail: (data = {}) =>
		request.get("/app/user/getDoneTaskDetail", data), //获取已办详情数据
	getWaitTime: (data = {}) => request.get("/app/user/getWaitTime", data), //获取待办事项条数
	getSettlementDetail: (data = {}) =>
		request.get("/app/labourSettlement/findById", data), //工资记录 -结算/发放详情
	getSettlementDetailtwo: (data = {}) =>
		request.get("/app/labourSettlement/getSettlementDetail", data), //工资记录 -结算/发放详情
	getSettlementMembers: (data = {}) =>
		request.get("/app/labourSettlement/getSettlementMembers", data), //查询结算/发放人员
	getSettlementBeginTime: (data = {}) =>
		request.get("/app/labourSettlement/getSettlementBeginTime", data), //查询周期开始日期 (取上一个周期的结束日期)
	addTrainUserSign: (data = {}) =>
		request.post("/app/labourTrain/addTrainUserSign", data), //培训扫码签到
	confirmSettlement: (data = {}) =>
		request.put("/app/labourSettlement/confirmSettlement", data), //确认结算/发放
	selectById: (data = {}) =>
		request.get("/app/labourTeamMembers/selectById", data), //根据id获取班组信息
	certification: (data = {}) =>
		request.post("/app/enterprise/faceSwiping", data), //企业实名认证
	peoCertification: (data = {}) =>
		request.post("/app/enterprise/actualAuth", data), //个人实名认证
	getPreAuthorizeTime: (data = {}) =>
		request.get("/app/user/getPreAuthorizeTime", data), //获取上一次认证时间
	modifyPassWord: (data = {}) => request.post("/app/user/modifyPassWord", data), //修改密码
	modifyPhone: (data = {}) => request.post("/app/user/modifyPhone", data), //修改手机号码
	modifySelfInfo: (data = {}) => request.post("/app/user/modifySelfInfo", data), //修改个人信息
	faceAuthorize: (data = {}) =>
		request.get("/app/enterprise/swipingAuthentication", data), //人脸识别
	createContractDocument: (data = {}) =>
		request.post("/app/labourTeamMembers/createContractDocument", data), //生成合同文件
	bindRelation: (data = {}) =>
		request.post("/app/labourContract/bindRelation", data), //新增合同与劳务工人绑定关系
	validateCode: (data = {}) => request.post("/app/user/validateCode", data), //新增合同与劳务工人绑定关系
	dismissMember: (data = {}) =>
		request.post("/app/labourTeamMembers/dismissMember", data), //辞退员工
	findContractDocumentStatus: (data = {}) =>
		request.post("/app/labourTeamMembers/findContractDocumentStatus", data), //根据合同id查看合同状态
	switchLogin: (data = {}) => request.post("/auth/switchLogin", data), //切换账号-APP
	confirmOrder: (data = {}) =>
		request.post("/eng/orderPurchase/appConfirmOrderPurchase", data), //扫二维码后，APP端确认采购单
	findPurchaseOrderById: (data = {}) =>
		request.get("/eng/h5/findPurchaseOrderById", data), //根据采购单ID查询物资采购单 app端
	addAndUpdate: (data = {}) =>
		request.get("/app/statsProjectSettle/findStatsProjectSettleById", data), //根据ID查看结算信息
	projectExamine: (data = {}) =>
		request.put("/app/statsProjectSettle/projectExamine", data), //项目结算-审批
	findUserListByType: (data = {}) =>
		request.get("/app/statsProjectSettle/findUserListByType", data), //根据结算类型获取员工列表

	checkSignPerson: (data = {}) =>
		request.get("/app/user/checkSignPerson", data), //检查签名人跟登录人是否同一个人 0:不是 1:是
	saveSignImg: (data = {}) => request.post("/app/public/saveSign", data), //签名保存
	approverAuthentication: (data = {}) =>
		request.post("/eng/enterprise/swipingAuthentication", data), //审批核身认证
	getUploadFileToken: (data = {}) =>
		request.get("/eng/file/temporary/token", data), // 获取图片上传临时token
	getMatterInfo: (data = {}) => request.get("/app/user/getMatterInfo", data), // 查询首页消息列表
	findArticleAppointById: (data = {}) =>
		request.get("/app/oaArticle/findArticleAppointById", data), // 根据ID查询转发人员文章表数据
	acceptArticleAppoint: (data = {}) =>
		request.put("/app/oaArticle/acceptArticleAppoint?pkId=" + data.pkId, data), // 首页的待办事项接收转发收文
	projectListNoUserId: (data = {}) =>
		request.get("/app/projProject/projectListNoUserId", data), // 获取当前组织的所有标段项目数据集
	getCustomerTelephone: (data = {}) =>
		request.get("/app/public/customerTelephone", data), // 获取客服联系电话
	unsubscribe: (data = {}) => request.put("/app/user/unsubscribe", data), // 注销app账户
	// ===================================设计变更 开始===================================================
	getDesignDetail: (data = {}) =>
		request.get("/app/prodChangesDesign/getDetail", data), // 查询详情
	approvalProcess: (data = {}) =>
		request.post("/app/prodChangesDesign/approvalProcess", data), //审批流程
	changeStatsQuery: (data = {}) =>
		request.get("/app/prodChangesDesign/changeStatsQuery", data), //查询变更状态字典
	findNextUser: (data = {}) =>
		request.get("/app/prodChangesDesign/findNextUser", data), //查询下一个节点审批人
	getChangeType: (data = {}) =>
		request.get("/app/prodChangesDesign/getChangeType", data), //查询变更类型
	getContractCustom: (data = {}) =>
		request.get("/app/prodChangesDesign/getContractCustom", data), //查询合同签署区(按照顺序 第一个是本单位签署的)
	getSealPerson: (data = {}) =>
		request.get("/app/prodChangesDesign/getSealPerson", data), //查询签章人
	signatureContract: (data = {}) =>
		request.get("/app/prodChangesDesign/signatureContract", data), //获取签章链接
	startSeal: (data = {}) =>
		request.post("/app/prodChangesDesign/startSeal", data), //发起签章
	transSeal: (data = {}) =>
		request.post("/app/prodChangesDesign/transSeal", data), //转交签章
	validateBeforeGetSealPerson: (data = {}) =>
		request.post("/app/prodChangesDesign/validateBeforeGetSealPerson", data), //查询签章人之前的校验 查看单位是否企业认证
	withdrawDesignActivity: (data = {}) =>
		request.post(
			"/app/prodChangesDesign/withdrawActivity?changeId=" + data.changeId,
			data
		), //撤回设计变更流程
	searchChangesDesigPage: (data = {}) =>
		request.get("/app/prodChangesDesign/searchPage", data), //设计变更分页
	getCreateUserList: (data = {}) =>
		request.get("/app/prodChangesDesign/getCreateUserList", data), //查询发起人列表
	changeStatsQuery: (data = {}) =>
		request.get("/app/prodChangesDesign/changeStatsQuery", data), //查询变更状态字典
	updateChange: (data = {}) =>
		request.put("/app/prodChangesDesign/update", data), //修改变更设计
	getChangeWorkflowTable: (data = {}) =>
		request.get("/app/prodChangesDesign/getWorkflowTable", data), //获取设计变更的表格
	getChangeWorkflowDetail: (data = {}) =>
		request.get("/app/prodChangesDesign/getWorkflowDetail", data), //查询流程详情
	// ===================================设计变更 开始===================================================
	// =================================工程结算开始======================================================
	projectQuerySettleInfo: (data = {}) =>
		request.get("/app/statsProjectSettle/findStatsProjectSettleById", data), //根据ID查看结算信息
	searchSettingPage: (data = {}) =>
		request.get("/app/statsProjectSettle/searchPage", data), //根据条件查询工程结算，分页展示
	searchSettingSummary: (data = {}) =>
		request.get("/app/statsProjectSettle/searchSummary", data), //根据条件查询进度和结算汇总
	withdrawalProcessingNode: (data = {}) =>
		request.put(
			"/app/statsProjectSettle/withdrawalProcessingNode?settleId=" +
			data.settleId,
			data
		), //撤回流程节点
	findUserListByWorkflowId: (data = {}) =>
		request.get("/app/statsProjectSettle/findUserListByWorkflowId", data), //获取下一审批人
	getSettleWorkflowDetail: (data = {}) =>
		request.get("/app/statsProjectSettle/getWorkflowDetail", data), //查询流程详情
	getAddSettlementFront: (data = {}) =>
		request.get("/app/statsProjectSettle/addSettlementFront", data), //根据当前登录组织ID以及结算对象ID查询新增结算前置条件
	searchStatsItemFinishByPkId: (data = {}) =>
		request.get("/app/statsProjectSettle/searchStatsItemFinishByPkId", data), //根据当前结算主键查询分项工程列表
	searchSettleContract: (data = {}) =>
		request.get("/app/statsProjectSettle/searchContract", data), //获取结算清单
	getSettleWorkflowTable: (data = {}) =>
		request.get("/app/statsProjectSettle/getWorkflowTable", data), //获取结算的表格
	updateSettle: (data = {}) =>
		request.put("/app/statsProjectSettle/update", data), //编辑工程结算
	// ===================================设计变更 开始===================================================
	// 施工验收接口
	getConstruction: (data = {}) =>
		request.get("/app/prodProcessApprove/findProcessApproveById", data), // 查询施工流程
	getStaff: (data = {}) =>
		request.get("/app/prodProcessApprove/findUserListByWorkflowId", data), // 获取员工
	processFlow: (data = {}) =>
		request.put("/app/prodProcessApprove/processingNodeApproval", data), //处理流程
	//====================================技术交底==========================================================
	updateEnableStatusAndMatter: (data = {}) =>
		request.post(
			"/app/prodTechnicalDisclosure/updateEnableStatusAndMatter",
			data
		), //待办事件里的根据ID接收技术交底
	technicalDisclosure: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/selectById", data), //根据ID查询技术交底
	deptListById: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/deptListById", data), //抄送时查询当前登录组织下的所有部门和员工
	carbonCopy: (data = {}) =>
		request.post("/app/prodTechnicalDisclosure/copy", data), //待办事件里的根据ID接收技术交底
	updateEnableStatus: (data = {}) =>
		request.post("/app/prodTechnicalDisclosure/updateEnableStatus", data), // 根据ID接收或撤回技术交底
	//====================================技术交底==========================================================
	// ================================= 盘点
	getConstruction2: (data = {}) =>
		request.get("/app/orderInventory/findById", data), // 查询盘点
	getStaff2: (data = {}) =>
		request.get("/app/orderInventory/findUserList", data), // 获取盘点员工
	processFlow2: (data = {}) =>
		request.put("/app/orderInventory/approvalProcess", data), //处理流程
	getOrderInventoryWorkflowDetail: (data = {}) =>
		request.get("/app/orderInventory/getWorkflowDetail", data), //获取模板节点审批信息(查询流程详情)
	// ===================================合同管理开始==================================================
	contractSearch: (data = {}) => request.get("/app/projContract/search", data), // 根据条件查询合同数据集
	findContractById: (data = {}) =>
		request.get("/app/projContract/findContractById", data), // 根据合同ID查询合同信息
	contractDetailsByContractId: (data = {}) =>
		request.get("/app/projContract/contractDetailsByContractId", data), // 根据合同ID查询合同清单数据集
	contractSupplyMaterialSearch: (data = {}) =>
		request.get("/app/projContract/contractSupplyMaterialSearch", data), // 根据合同ID查询合同供应材料数据集
	contractDetailExportFile: (data = {}) =>
		request.get("/app/projContract/contractDetailExportFile", data), // 合同清单表格导出
	// ===================================合同管理结束==================================================
	// ===================================项目管理开始==================================================
	findProjectTableByProjectId: (data = {}) =>
		request.get("/app/projProjectTable/findProjectTableByProjectId", data), // 根据项目部ID查询工程项目数据集
	findProjectByProOrgId: (data = {}) =>
		request.get("/app/projProject/findProjectByProOrgId", data), // 根据项目部ID查询项目信息
	// ===================================项目管理结束==================================================
	// ===================================客户管理开始==================================================
	addCustom: (data = {}) => request.post("/app/appCustom/add", data), // 新增客户数据
	clearCustomLink: (data = {}) =>
		request.deleter("/app/appCustom/clearCustomLink", data), // 删除客户关联信息
	customSearchByProOrgId: (data = {}) =>
		request.get("/app/appCustom/customSearchByProOrgId", data), // 根据当前登录关联项目集查询关联的分包商集
	getCooperator: (data = {}) =>
		request.get("/app/appCustom/getCooperator", data), // 获取合作单位
	getParentOrg: (data = {}) => request.get("/app/appCustom/getParentOrg", data), // 获取上级单位
	getSubOrg: (data = {}) => request.get("/app/appCustom/getSubOrg", data), // 获取分包商
	getSupplyOrg: (data = {}) => request.get("/app/appCustom/getSupplyOrg", data), // 获取供应商
	updateCustom: (data = {}) =>
		request.post("/app/appCustom/updateCustom", data), // 修改客户
	updateRelationById: (data = {}) =>
		request.post("/app/appCustom/updateRelationById", data), // 根据ID修改客户绑定
	searchOrgLinkPhone: (data = {}) =>
		request.get("/app/appCustom/orgLinkPhone", data), // 根据联系人手机号查询公司信息
	// ===================================客户管理结束==================================================
	// ===================================生产设置开始==================================================
	prodEngineeringDrawing: (data = {}) =>
		request.get("/app/prodEngineeringDrawing/search", data), // 条件查询工程图纸数据集
	searchItemsByDrawId: (data = {}) =>
		request.get("/app/prodEngineeringDrawing/searchItemsByDrawId", data), // 查询图纸ID查询图纸关联分项工程数据集
	searchItemWithDrawing: (data = {}) =>
		request.get("/app/appProdItemList/searchItemWithDrawing", data), // 单位分部分项表 携带图纸
	searchItemWithDetails: (data = {}) =>
		request.get("/app/appProdItemList/searchItemWithDetails", data), // 单位分部分项表带清单
	searchDeptList: (data = {}) =>
		request.get("/app/sysDept/searchDeptList", data), // 根据当前登陆者组织，查询该组织下所有部门列表
	searchUserPageForOrgId: (data = {}) =>
		request.get("/app/appProdItemList/searchUserPageForOrgId", data), // 根据当前登录者组织id查询下属所有员工集带工区名称和分页
	findReUserAreaItemByUserId: (data = {}) =>
		request.get("/app/appProdItemList/searchUserWorkArea", data), // 根据员工ID查询员工与工区关系数据
	getFlowDiagramByItemId: (data = {}) =>
		request.get("/app/appProdItemList/getWorkflowTemplateByItemId", data), // 根据分项id获取流程图
	searchRoleList: (data = {}) =>
		request.get("/app/sysRole/searchEasyRoleList", data), // 查角色
	searchRolesByProcess: (data = {}) =>
		request.get("/app/prodWorkArea/searchRolesByProcess", data), // 查询组织下的有施工验收权限的角色列表
	searchAllUserWorkArea: (data = {}) =>
		request.get("/app/appProdItemList/searchAllUserWorkArea", data), // 查询工区
	searchItemWithMaterials: (data = {}) =>
		request.get("/app/appProdItemList/searchItemWithMaterials", data), // 单位分部分项表带物料
	searchMaterialSummary: (data = {}) =>
		request.get("/app/appProdItemList/searchMaterialSummary", data), // 查询物料分类汇总
	searchWorkArea: (data = {}) =>
		request.get("/app/appProdItemList/searchWorkArea", data), // 查询工区
	searchDeptList: (data = {}) =>
		request.get("/app/sysDept/searchDeptList", data), // 根据当前登陆者组织，查询该组织下所有部门列表
	searchUserPageForOrgId: (data = {}) =>
		request.get("/app/appProdItemList/searchUserPageForOrgId", data), // 根据当前登录者组织id查询下属所有员工集带工区名称和分页
	// findReUserAreaItemByUserId: (data = {}) => request.get("/app/appProdItemList/findReUserAreaItemByUserId", data), // 根据员工ID查询员工与工区关系数据
	searchDetection: (data = {}) =>
		request.get("/app/orderInputInventoryDetection/search", data), // 根据条件查询物资入库单检测表
	addDetection: (data = {}) =>
		request.post("/app/orderInputInventoryDetection/add", data), // 新增物资入库单检测表数据
	findDetectionByInputId: (data = {}) =>
		request.get("/app/orderInputInventoryDetection/findByInputId", data), // 根据入库ID查询物资入库单检测表数据集
	searchMaterialByInput: (data = {}) =>
		request.get(
			"/app/orderInputInventoryDetection/searchMaterialByInput",
			data
		), // 根据当前项目部ID或项目ID查询来料对象为供应商的入库单关联的物料数据集
	findCustomByOrgId: (data = {}) =>
		request.get("/app/appProdItemList/findCustomByOrgId", data), // 根据所属公司ID以及客户类型查询客户ID
	findItemByCustomId: (data = {}) =>
		request.get("/app/appProdItemList/findItemByCustomId", data), // 查询分包商绑定的分项
	findAreaCustom: (data = {}) =>
		request.get("/app/appProdItemList/findAreaCustom", data), // 根据当前登录项目部ID条件查询分包商集 带工区名称和分页
	searchCustomWorkArea: (data = {}) =>
		request.get("/app/appProdItemList/searchCustomWorkArea", data), // 查询分包商工区
	// ===================================生产设置结束==================================================
	// ===================================生产管理开始====================================================
	prodTechnicalDisclosureSearch: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/search", data), // 根据条件查询技术交底数据集
	prodTechnicalDisclosureAdd: (data = {}) =>
		request.post("/app/prodTechnicalDisclosure/add", data), //新增技术交底
	constructionLogUpdate: (data = {}) =>
		request.put("/app/prodConstructionJournal/update", data), //根据ID修改施工日志数据
	prodConstructionJournal: (data = {}) =>
		request.get("/app/prodConstructionJournal/search", data), // 根据条件查询施工日志
	weatherStatsAllList: (data = {}) =>
		request.get("/app/prodConstructionJournal/weatherStatsAllList", data), // 查询所有天气状态
	temperatureAllList: (data = {}) =>
		request.get("/app/prodConstructionJournal/temperatureAllList", data), // 查询所有温度列表
	constructionLogSelectById: (data = {}) =>
		request.get("/app/prodConstructionJournal/selectById", data), // 根据ID查询施工日志数据
	searchItemsByOrgId: (data = {}) =>
		request.get("/app/appProdItemList/searchItemsByOrgId", data), // 根据当前登录项目部ID查询扁平线分项工程数据集
	constructionLogAdd: (data = {}) =>
		request.post("/app/prodConstructionJournal/addBatch", data), //批量新增施工日志数据
	statsItemTrackSearch: (data = {}) =>
		request.get("/app/statsItemFinishRecord/statsItemTrackSearch", data), // 根据条件查询生产跟踪
	getOneQualityAndSecurityByItemId: (data = {}) =>
		request.get(
			"/app/statsItemFinishRecord/getOneQualityAndSecurityByItemId",
			data
		), // 根据条件查询生产跟踪详情
	searchAllWorkArea: (data = {}) =>
		request.get("/app/appProdItemList/searchAllWorkArea", data), // 查询所有工区
	clearAcceptanceRecords: (data = {}) =>
		request.put("/app/prodProcessApprove/clearProcessData", data), // 清除生产审批流数据

	// ===================================生产管理结束====================================================

	// ===================================施工验收开始====================================================
	flowCheckout: (data = {}) =>
		request.get("/app/prodProcessApprove/searchPage", data), // 根据当前登录组织ID和员工ID查询员工所在的工区集绑定的分包商集
	sponsorList: (data = {}) =>
		request.get("/app/prodProcessApprove/findUserListByProOrgId", data), // 根据当前登录项目部ID获取流程发起人列表
	getProcessData: (data = {}) =>
		request.get("/app/prodProcessApprove/searchProcessByItemId", data), // 分项ID获取对应流程
	searchItemsIgnore: (data = {}) =>
		request.post("/app/prodProcessApprove/searchItemsIgnore", data), // 分项工程集
	addprocess: (data = {}) => request.post("/app/prodProcessApprove/add", data), // 新增生产流程
	updateProcess: (data = {}) =>
		request.put("/app/prodProcessApprove/update", data), // 修改生产流程
	getWorkflowDetail: (data = {}) =>
		request.get("/app/prodProcessApprove/getWorkflowDetail", data), // 新增或编辑施工验收的时候流程图的展示
	getWorkflowTables: (data = {}) =>
		request.get("/app/prodProcessApprove/getWorkflowTable", data), // 用于查询施工验收发起时表格
	// ===================================施工验收结束====================================================

	// ===================================进度计划开始==================================================
	findWorkAreasByUserId: (data = {}) =>
		request.get("/app/prodWorkArea/findWorkAreasByUserId", data), // 根据当前登录组织ID和员工ID查询员工所在的工区集绑定的分包商集
	findCustomByUserId: (data = {}) =>
		request.get("/app/prodWorkArea/findCustomByUserId", data), // 根据当前登录组织ID和员工ID查询员工所在的工区集绑定的分包商集
	searchPlanAndDetail: (data = {}) =>
		request.get("/app/projPlan/searchPlanAndDetail", data), // 根据条件查询计划及计划明细
	searchPlanActual: (data = {}) =>
		request.get("/app/statsItemFinishRecord/searchActual", data), // 根据条件查询实际完成
	searchPlanSummary: (data = {}) =>
		request.get("/app/statsItemFinishRecord/searchSummary", data), // 根据条件查询进度汇总
	// ===================================进度计划结束==================================================
	// ===================================公共服务管理开始==================================================
	getBusinessCode: (data = {}) =>
		request.get("/app/public/getBusinessCode", data), // 根据业务类型获取业务单号
	findDictAllList: (data = {}) =>
		request.get("/app/dict/findDictAllList", data), // 根据业务类型获取业务单号
	// ===================================公共服务管理结束==================================================
	// =======================================质量与安全日常管理============================================
	searchPage: (data = {}) =>
		request.get("/app/statsQualitySafetyDaily/searchPage", data), // 根据条件查询质量与安全日常管理，分页展示
	searchSafetyDaily: (data = {}) =>
		request.get("/app/statsQualitySafetyDaily/search", data), // 根据条件查询质量与安全日常管理
	inspectTypeAllList: (data = {}) =>
		request.get("/app/statsQualitySafetyDaily/inspectTypeAllList", data), // 获取安全日常检查类型列表
	safetyDailySelectById: (data = {}) =>
		request.get("/app/statsQualitySafetyDaily/selectById", data), // 根据ID查询质量与安全日常管理数据
	safetyDailyUpdate: (data = {}) =>
		request.post("/app/statsQualitySafetyDaily/update", data), // 根据ID修改质量与安全日常管理数据
	safetyDailyAdd: (data = {}) =>
		request.post("/app/statsQualitySafetyDaily/add", data), // 新增质量与安全日常管理数据
	safetyDailyDeleter: (data = {}) =>
		request.deleter("/app/statsQualitySafetyDaily/delete", data), // 根据ID删除质量与安全日常管理
	getsafetImg: (data = {}) =>
		request.get("/app/statsQualitySafetyHierarchy/search", data), // 根据条件查询质量与安全体系
	searchOther: (data = {}) =>
		request.get("/app/statsQualitySafetyDaily/searchOther", data), // 查询所有的时间和人
	addAndUpdateApp: (data = {}) =>
		request.post("/app/statsQualitySafetyHierarchy/addAndUpdate", data), // 新增或修改质量与安全体系数据
	hierarchyDelete: (data = {}) =>
		request.deleter("/app/statsQualitySafetyHierarchy/delete", data), // 根据ID删除质量与安全日常管理

	// =======================================质量与安全日常管理============================================
	// =======================================质量与安全上级检查管理开始============================================
	firstQualityAdd: (data = {}) =>
		request.post("/app/statsQualitySafetyInspect/add", data), // 新增质量与安全上级检查数据
	firstQualityDelete: (data = {}) =>
		request.deleter("/app/statsQualitySafetyInspect/delete", data), // 根据ID删除质量与安全上级检查
	firstQualityAll: (data = {}) =>
		request.get("/app/statsQualitySafetyInspect/searchOther", data), // 查询所有的时间和人
	firstQualitySearchPage: (data = {}) =>
		request.get("/app/statsQualitySafetyInspect/searchPage", data), //根据条件查询质量与安全上级检查，分页展示
	firstQualityById: (data = {}) =>
		request.get("/app/statsQualitySafetyInspect/selectById", data), //根据ID查询质量与安全上级检查数据
	firstQualityUpdate: (data = {}) =>
		request.put("/app/statsQualitySafetyInspect/update", data), //根据ID修改质量与安全上级检查数据
	searchByCompanyType: (data = {}) =>
		request.get("/app/appCustom/searchByCompanyType", data), //根据ID查询质量与安全上级检查数据
	firstQualitySearchPage: (data = {}) =>
		request.get("/app/statsQualitySafetyInspect/searchPage", data), //根据条件查询质量与安全上级检查，分页展示
	firstQualityById: (data = {}) =>
		request.get("/app/statsQualitySafetyInspect/selectById", data), //根据ID查询质量与安全上级检查数据
	firstQualityUpdate: (data = {}) =>
		request.put("/app/statsQualitySafetyInspect/update", data), //根据ID修改质量与安全上级检查数据
	// =======================================质量与安全上级检查管理结束============================================
	// =======================================质量评定============================================
	qualityEvaluation: (data = {}) =>
		request.get("/app/statsQualityEvaluate/search", data), //根据条件查询质量评定数据集
	qualityEvaluationById: (data = {}) =>
		request.get("/app/statsQualityEvaluate/selectById", data), //根据分项工程ID查询质量评定数据
	qualitySelectByItemId: (data = {}) =>
		request.get("/app/statsQualityEvaluate/selectByItemId", data), //新增评定表前根据分项工程ID查询数据集
	qualityEvaluationAdd: (data = {}) =>
		request.post("/app/statsQualityEvaluate/add", data), //新增质量评定数据
	qualityEvaluationUpdate: (data = {}) =>
		request.put("/app/statsQualityEvaluate/update", data), //根据ID修改质量评定数据
	// =======================================质量评定============================================
	// =======================================财务管理============================================
	settlePage: (data = {}) => request.get("/app/finance/settlePage", data), //财务管理-供应商结算/分包商结算
	materialSettleSearchPage: (data = {}) =>
		request.get("/app/finance/materialSettleSearchPage", data), //财务管理-供应商结算-供货结算流水
	materialDeductSearchPage: (data = {}) =>
		request.get("/app/finance/materialDeductSearchPage", data), //财务管理-分包商結算-物资扣除结算表
	costManagePage: (data = {}) =>
		request.get("/app/finance/costManagePage", data), //财务管理-管理成本
	subCalculatePriceSearchPage: (data = {}) =>
		request.get("/app/finance/subCalculatePriceSearchPage", data), //财务管理-分包商结算-分包计价
	searchMaterialType: (data = {}) =>
		request.get("/app/materialType/searchMaterialType", data), //查询物料类型下拉
	// =======================================财务管理============================================
	// =======================================签章流程============================================
	approvalSealProcess: (data = {}) =>
		request.post("/app/workflowSeal/approvalSealProcess", data), // 审批签章流程
	withdrawSeal: (data = {}) =>
		request.post("/app/workflowSeal/withdrawSeal?pkId=" + data.pkId, data), // 撤回签章
	findSealDetail: (data = {}) =>
		request.get("/app/workflowSeal/findSealDetail", data), // 获取签章详情
	getSignUrl: (data = {}) => request.get("/app/workflowSeal/getSignUrl", data), // 获取签署链接
	initiateSealProcess: (data = {}) =>
		request.post("/app/workflowSeal/initiateSealProcess", data), // 发起用章审批
	initiateSealProcessBefore: (data = {}) =>
		request.get("/app/workflowSeal/initiateSealProcessBefore", data), // 查询签章表格并携带审批人信息
	querySealEnable: (data = {}) =>
		request.get("/app/workflowSeal/querySealEnable", data), // 查询该流程是否配置了用章流程
	getSignWorkflowDetail: (data = {}) =>
		request.get("/app/workflowSeal/getWorkflowDetail", data), // 获取用章审批人
	// =======================================签章流程============================================
	// =======================================成本管理开始============================================
	costSubcontractSearch: (data = {}) =>
		request.get("/app/projCostManage/costSubcontractSearch", data), // 条件查询责任成本的分包成本
	searchCostMaterial: (data = {}) =>
		request.get("/app/projCostManage/searchCostMaterial", data), // 条件查询责任成本的物资成本
	searchCostDevice: (data = {}) =>
		request.get("/app/projCostManage/searchCostDevice", data), // 条件查询责任成本的设备成本
	actualCostAccountList: (data = {}) =>
		request.get("/app/projCostManage/actualCostAccountList", data), // 条件查询实际成本中的成本核算数据集
	actualCostDeviceSearch: (data = {}) =>
		request.get("/app/projCostManage/actualCostDeviceSearch", data), // 条件查询实际成本的设备成本
	actualCostMaterialSearch: (data = {}) =>
		request.get("/app/projCostManage/actualCostMaterialSearch", data), // 条件查询实际成本的物资成本
	actualCostSearch: (data = {}) =>
		request.get("/app/projCostManage/actualCostSearch", data), // 条件查询实际成本的分包成本
	searchCostManage: (data = {}) =>
		request.get("/app/projCostManage/searchCostManage", data), // 条件查询成本管理(责任和实际)的管理成本
	findOutById: (data = {}) =>
		request.get("/app/inventory/out/findOutById", data), // 根据出库单主键id查询单据信息
	findDeviceById: (data = {}) =>
		request.get("/app/projCostManage/findById", data), // 根据id查询设备信息
	businessAccountList: (data = {}) =>
		request.get("/app/projCostManage/businessAccountList", data), // 根据id查询设备信息

	// =======================================陈本管理结束============================================
	customsContainByOrgId: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/customsContainByOrgId", data), // 查询关联的分包商集(排除没有下属员工的数据)和当前项目部的所有部门和员工
	customsContainUsers: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/customsContainUsers", data), // 根据当前登录项目部ID查询关联的分包商集(排除没有下属员工的数据)
	operateManage: (data = {}) =>
		request.get("/app/operateManage/paymentFlow", data), // 查询收付款管理-支付流水
	deductionSettlement: (data = {}) =>
		request.get("/app/operateManage/subCalculatePriceSearchPage", data), // 查询收付款管理-分包计价
	deductionMaterials: (data = {}) =>
		request.get("/app/operateManage/materialDeductSearchPage", data), // 查询收付款管理-物资扣除
	getFinanceIntercourseSummary: (data = {}) =>
		request.get("/app/operateManage/getFinanceIntercourseSummary", data), // 查询收付款管理-汇总数据
	getMaterialsDeductionSettlementStatement: (data = {}) =>
		request.get("/app/operateManage/materialDeductSearch", data), // 查询收付款管理-物资扣除结算表
	// =======================================物料申请单管理开始============================================
	orderApplySearchPage: (data = {}) =>
		request.get("/app/orderApply/searchPage", data), //根据条件查询物资申请单，分页展示
	orderApplyAdd: (data = {}) => request.post("/app/orderApply/add", data), //新增物资申请单数据
	orderApplyDelete: (data = {}) =>
		request.deleter("/app/orderApply/delete", data), // 根据ID删除物资申请单
	orderApplyFindById: (data = {}) =>
		request.get("/app/orderApply/findById", data), //根据ID查询物资申请单数据
	findOrderApplyByCustomerId: (data = {}) =>
		request.get("/app/orderApply/findOrderApplyByCustomerId", data), //根据客户id和申请单编码获取物资申请单列表
	orderApplyUpdate: (data = {}) => request.put("/app/orderApply/update", data), //根据ID修改物资申请单数据
	updateApplyCodeByBusinessType: (data = {}) =>
		request.put("/app/orderApply/updateApplyCodeByBusinessType", data), //根据主键ID和业务类型修改物资申请单状态
	getItemsByProjectId: (data = {}) =>
		request.get("/app/appProdItemList/getItemsByProjectId", data), //根据主键ID和业务类型修改物资申请单状态
	searchMaterialPage: (data = {}) =>
		request.get("/app/public/searchMaterialPage", data), //根据当前登录组织分页查询指定来源物料数据集
	materialTypeSearch: (data = {}) =>
		request.get("/app/materialType/search", data), //根据当前登录组织分页查询指定来源物料数据集

	// =======================================物料申请单管理结束============================================

	// ======================================= 物料采购开始 ============================================
	getClient: (data = {}) =>
		request.get("/app/appCustom/searchNoLinkOrgId", data), //获取关联客户
	materialPurchasing: (data = {}) =>
		request.get("/app/orderPurchase/searchPage", data), //根据条件查询物资申请单，分页展示
	queryMaterialOder: (data = {}) =>
		request.get("/app/orderPurchase/findById", data), //根据ID查询物资采购单数据
	searchOrderPurchaseNoLink: (data = {}) =>
		request.get("/app/orderPurchase/searchNoLink", data), //根据分包单位组织ID集查询供应商客户的直供分包单位客户数据集
	addMaterialOder: (data = {}) => request.post("/app/orderPurchase/add", data), // 新增采购单
	modifyStatus: (data = {}) =>
		request.put("/app/orderPurchase/updateOrderPurchaseByBusinessType", data), // 修改物资采购单状态
	// ======================================= 物料采购开始 ============================================
	// =======================================普通材料发料开始============================================
	orderOrdinaryApplyAdd: (data = {}) =>
		request.post("/app/orderOrdinaryApply/add", data), // 新增普通材料发料单
	orderOrdinaryApplyDelete: (data = {}) =>
		request.deleter("/app/orderOrdinaryApply/delete", data), // 根据ID删除普通材料发料单表
	orderOrdinaryApplyFindById: (data = {}) =>
		request.get("/app/orderOrdinaryApply/findById", data), //根据ID查询普通材料发料单
	findOrderOrdinaryByWarehouseId: (data = {}) =>
		request.get("/app/orderOrdinaryApply/findOrderOrdinaryByWarehouseId", data), //根据条件查询普通材料发料单表
	orderOrdinaryApplyPage: (data = {}) =>
		request.get("/app/orderOrdinaryApply/searchPage", data), //分页查询普通材料发料单表
	orderOrdinaryApplyUpdate: (data = {}) =>
		request.put("/app/orderOrdinaryApply/update", data), //根据ID修改普通材料发料单
	updateOrdinaryApplyByBusinessType: (data = {}) =>
		request.put(
			"/app/orderOrdinaryApply/updateOrdinaryApplyByBusinessType",
			data
		), //根据主键ID和业务类型修改普通材料发料单状态
	// =======================================普通材料发料结束============================================
	// =======================================库存信息开始============================================
	warehouseSearchPage: (data = {}) =>
		request.get("/app/warehouse/searchPage", data), //根据条件查询仓库表，分页展示
	warehouseAdd: (data = {}) => request.post("/app/warehouse/add", data), // 新增仓库表数据
	warehouseDelete: (data = {}) =>
		request.post("/app/warehouse/delete?pkId=" + data.pkId), // 根据ID删除仓库表
	warehouseFindById: (data = {}) =>
		request.get("/app/warehouse/findById", data), //根据ID查询仓库表数据
	findCustomWarehouse: (data = {}) =>
		request.get("/app/warehouse/findCustomWarehouse", data), //查询自己客户仓库列表
	findSelfWarehouse: (data = {}) =>
		request.get("/app/warehouse/findSelfWarehouse", data), //查询自己企业下仓库列表
	findWarehouseByOrgId: (data = {}) =>
		request.get("/app/warehouse/findWarehouseByOrgId", data), //根据组织获取虚拟仓
	findWarehouseByProjectId: (data = {}) =>
		request.get("/app/warehouse/findWarehouseByProjectId", data), //根据标段项目id查询仓库列表
	toggleRepository: (data = {}) =>
		request.post("/app/warehouse/toggleRepository", data), //停用/启用仓库
	warehouseUpdate: (data = {}) => request.post("/app/warehouse/update", data), //根据ID修改仓库表数据
	searchUserListById: (data = {}) =>
		request.get("/app/sysUser/searchUserListById", data), //根据组织主键id查询员工列表
	warehouseMaterialList: (data = {}) =>
		request.get("/app/materialInventory/searchPage", data), //仓库物料库存表
	warehouseMaterialList2: (data = {}) =>
		request.get("/app/materialInventory/firstSupplySearchPage", data), //甲供库存
	ledger: (data = {}) => request.get("/app/materialAccount/searchPage", data), //台账表
	changeRecord: (data = {}) =>
		request.get("/app/materialInventory/changeRecordSearchPage", data), //仓库物料变动记录
	firstChangeRecordSearchPage: (data = {}) =>
		request.get("/app/materialInventory/firstChangeRecordSearchPage", data), //甲供库存变动记录

	// =======================================库存信息结束============================================
	// =======================================库存预算开始============================================
	materialInventoryAlertAdd: (data = {}) =>
		request.post("/app/materialInventoryAlert/add", data), // 新增物料库存预警数据
	materialInventoryAlertDelete: (data = {}) =>
		request.deleter("/app/materialInventoryAlert/delete", data), // 根据ID删除物料库存预警
	materialInventoryAlertByIde: (data = {}) =>
		request.get("/app/materialInventoryAlert/findByIde", data), // 根据ID查询物料库存预警数据
	getMaterials: (data = {}) =>
		request.get("/app/materialInventoryAlert/getMaterials", data), // 查询物料
	searchMaterialsTree: (data = {}) =>
		request.get("/app/materialType/searchTree", data), // 查询物料分类
	getMaterialsInventory: (data = {}) =>
		request.get("/app/materialInventoryAlert/getMaterialsInventory", data), // 查询物料库存
	materialInventoryAlertPage: (data = {}) =>
		request.get("/app/materialInventoryAlert/searchPage", data), // 根据条件查询物料库存预警，分页展示
	materialInventoryAlertUpdate: (data = {}) =>
		request.put("/app/materialInventoryAlert/update", data), // 根据ID修改物料库存预警数据
	searchHaveLinkOrgId: (data = {}) =>
		request.get("/app/appCustom/searchHaveLinkOrgId", data), // 根据当前登录关联项目集查询关联的客户集
	// =======================================库存预算结束============================================
	// =======================================出入库开始============================================
	findOrderInputByWarehouseId: (data = {}) =>
		request.get("/app/inventory/findOrderInputByWarehouseId", data), // 根据查询条件获取入库单列表-出库时使用
	findOrderOutByWarehouseId: (data = {}) =>
		request.get("/app/inventory/findOrderOutByWarehouseId", data), // 根据查询条件获取出库单列表-入库时使用-来料对象为无时使用
	findOrderApplyByInputId: (data = {}) =>
		request.get("/app/orderApply/findOrderApplyByInputId", data), // 根据入库单id和申请单编码获取物资申请单列表
	addPutInventory: (data = {}) =>
		request.post("/app/inventory/input/add", data), // 新增入库单
	delPutInventory: (data = {}) =>
		request.deleter("/app/inventory/input/delete", data), // 根据id删除入库单
	findInputById: (data = {}) =>
		request.get("/app/inventory/input/findInputById", data), // 根据入库单主键id查询单据信息
	searchPutInventoryPage: (data = {}) =>
		request.get("/app/inventory/input/searchPage", data), // 入库单分页列表
	updatePutInventory: (data = {}) =>
		request.put("/app/inventory/input/update", data), // 编辑入库单
	checkPutInventory: (data = {}) =>
		request.put("/app/inventory/input/check", data), // 检测入库单
	inputWarehousing: (data = {}) =>
		request.put("/app/inventory/input/warehousing?pkId=" + data), // 入库单入库
	handlePutInventory: (data = {}) =>
		request.put("/app/inventory/input/handle", data), // 处理入库单
	retreatPutInventoryNoOut: (data = {}) =>
		request.put("/app/inventory/input/currency/retreat", data), // 入库单退货-已签收未入库退货-通用
	retreatPutInventorySub: (data = {}) =>
		request.put("/app/inventory/input/subcontract/retreat", data), // 入库单退货-分包商已入库退货
	retreatPutInventoryPro: (data = {}) =>
		request.put("/app/inventory/input/project/retreat", data), // 入库单退货-项目部已入库通用退货版
	retreatPutInventoryNoInput: (data = {}) =>
		request.put("/app/inventory/input/subcontract/unsigned/retreat", data), // 入库单退货-未签收分包商原路退回
	addOutInventory: (data = {}) => request.post("/app/inventory/out/add", data), // 新增出库单
	delOutInventory: (data = {}) =>
		request.deleter("/app/inventory/out/delete", data), // 新增入库单
	findOutById: (data = {}) =>
		request.get("/app/inventory/out/findOutById", data), // 根据入库单主键id查询单据信息
	searchOutInventoryPage: (data = {}) =>
		request.get("/app/inventory/out/searchPage", data), // 出库单分页列表
	updateOutInventory: (data = {}) =>
		request.put("/app/inventory/out/update", data), // 编辑出库单
	findProjectListByType: (data = {}) =>
		request.get("/app/projProject/findProjectListByType", data), // 根据类型获取标段项目列表信息
	searchProjCustomByType: (data = {}) =>
		request.get("/app/appCustom/searchProjCustomByType", data), // 根据标段查询以及客户类型查询客户信息
	findInputByOrderCode: (data = {}) =>
		request.get("/app/inventory/input/findInputByOrderCode", data), // 根据入库单编码查询单据信息
	findInputDetectionInfoById: (data = {}) =>
		request.get("/app/inventory/input/findInputDetectionInfoById", data), // 根据入库单主键id查询检测信息
	enterInfo: (data = {}) => request.post("/app/inventory/out/enterInfo", data), // 根据出库单id，录入签收信息
	searchItemsByProjectId: (data = {}) =>
		request.get("/app/appProdItemList/searchItemsByProjectId", data), // 根据标段项目ID查询树形分项工程集
	findPurchaseOrderByProjectId: (data = {}) =>
		request.get("/app/orderPurchase/findPurchaseOrderByProjectId", data), // 根据标段项目ID查询采购计划单列表
	// =======================================出入库结束============================================
	// ========================================================盘点管理开始=========================================================
	addOrderInventory: (data = {}) =>
		request.post("/app/orderInventory/add", data), // 新增物资盘点单数据
	// approvalOrderInventory: (data = {}) => request.put(  "/app/orderInventory/approvalProcess", data ), // 审批流程
	delOrderInventory: (data = {}) =>
		request.deleter("/app/orderInventory/delete", data), // 根据ID删除物资盘点单
	findOrderInventoryById: (data = {}) =>
		request.get("/app/orderInventory/findById", data), // 根据ID查询物资盘点单数据
	// findUserList: (data = {}) => request.get(  "/app/orderInventory/findUserList", data ), // 提交审批时获取员工列表
	getOrderInventoryProcess: (data = {}) =>
		request.get("/app/orderInventory/getOrderInventoryProcess", data), // 查询盘点单流程
	getWarehouseMaterial: (data = {}) =>
		request.get("/app/orderInventory/getWarehouseMaterial", data), // 查询库存物料
	searchOrderInventoryPage: (data = {}) =>
		request.get("/app/orderInventory/searchPage", data), // 根据条件查询物资盘点单，分页展示
	updateOrderInventory: (data = {}) =>
		request.post("/app/orderInventory/update", data), // 根据ID修改物资盘点单数据
	recallOrderInventory: (data = {}) =>
		request.post("/app/orderInventory/withdrawActivity?pkId=" + data.pkId, data), // 撤回流程
	getApproveMaterials: (data = {}) =>
		request.get("/app/orderInventory/getApproveMaterials", data), // 撤回流程
	// ========================================================盘点管理结束=========================================================
	// ========================================================分类统计开始=========================================================
	materialLedgerSearchPage: (data = {}) =>
		request.get("/app/materialInventory/materialLedgerSearchPage", data), // 查询物料台账
	materialTypeLedgerSearchPage: (data = {}) =>
		request.get("/app/materialInventory/materialTypeLedgerSearchPage", data), // 查询物料类型台账
	// ========================================================分类统计结束=========================================================

	// ************************************* 组织机构 ******************************************************************************
	getdepList: (data = {}) => request.get("/app/sysDept/searchPage", data), // 获取部门分页列表
	deleteDep: (data = {}) => request.deleter("/app/sysDept", data), // 删除部门
	getRoleList: (data = {}) => request.get("/app/sysRole/searchPage", data), // 获取角色列表
	queRole: (data = {}) => request.get("/app/sysRole", data), // id查询角色信息
	addRole: (data = {}) => request.post("/app/sysRole", data), // 新增角色
	editRole: (data = {}) => request.put("/app/sysRole", data), // 编辑角色
	deletRole: (data = {}) => request.deleter("/app/sysRole", data), // 删除角色
	getMenuList: (data = {}) =>
		request.get("/app/menu/searchForRoleMenuPermissionByOrgType", data), // 获取组织的菜单权限列表
	searchProjectOrg: (data = {}) =>
		request.get("/app/jurisdictionin/searchProjectOrg", data), // 所辖项目
	getAuthInfo: (data = {}) => request.get("/app/org/getAuthInfo", data), // 获取实名信息
	searchUserByOrg: (data = {}) =>
		request.get("/app/sysUser/searchUserByOrg", data), // 根据组织查询组织机构(员工列表)
	searchDeptListByOrgId: (data = {}) =>
		request.get("/app/sysDept/searchDeptListByOrgId", data), // 根据组织id查询该组织下所有部门列表
	searchDeptListByOrgId2: (data = {}) =>
		request.get("/app/prodWorkArea/searchDept", data), // 根据组织id查询该组织下所有部门列表
	searchEasyDeptList: (data = {}) =>
		request.get("/app/sysDept/searchEasyDeptList", data), // 根据组织id查询该组织下所有部门列表
	appSysUser: (data = {}) => request.get("/app/sysUser", data), // 根据员工主键id查询员工信息
	updateStatus: (data = {}) => request.put("/app/sysUser/updateStatus", data), // 修改员工账号状态
	addSysUser: (data = {}) => request.post("/app/sysUser", data), // 新增员工
	putSysUser: (data = {}) => request.put("/app/sysUser", data), // 修改员工
	// ************************************* 劳务管理 ******************************************************************************
	addTrain: (data = {}) => request.post("/app/labourTrain/add", data), // 新增培训
	// addTrainUserSign: (data = {}) => request.post("/app/labourTrain/addTrainUserSign", data), // 培训扫码签到(甲方主动扫码时，需要传用户ID)
	deleteTrain: (data = {}) => request.deleter("/app/labourTrain/delete", data), // 删除部门
	searchTrainById: (data = {}) =>
		request.get("/app/labourTrain/findById", data), // 根据培训ID查询培训
	projectsByUserId: (data = {}) =>
		request.get("/app/labourTrain/projectsByUserId", data), // 根据劳务工人查询关联项目数据集
	searchTrainPage: (data = {}) =>
		request.get("/app/labourTrain/searchPage", data), // 根据条件查询培训，分页展示
	searchstayPage: (data = {}) => request.get("/app/labourTrain/stayPage", data), // 分页查询待办培训数据集
	searchByCompany: (data = {}) =>
		request.get("/app/appCustom/searchByCompany", data), // 查询发起单位
	speakerTypeAllList: (data = {}) =>
		request.get("/app/labourTrain/speakerTypeAllList", data), // 查询所有主讲类型
	labourTeamSearch: (data = {}) =>
		request.get("/app/labourTeamMembers/labourTeamSearch", data), // 根据项目部ID查询班组集
	updateTrain: (data = {}) => request.put("/app/labourTrain/update", data), // 根据ID修改培训

	searchLabourTeamMembersPage: (data = {}) =>
		request.get("/app/labourTeamMembers/searchPage", data), // 根据条件查询劳务人员与班组关系数据，分页展示
	findLabourTeamMembersById: (data = {}) =>
		request.get("/app/labourTeamMembers/findById", data), // 根据劳务人员与班组ID查询劳务人员与班组关系数据

	addInsure: (data = {}) =>
		request.post("/app/labourTeamMembersInsure/add", data), // 新增保险
	deleteInsure: (data = {}) =>
		request.deleter("/app/labourTeamMembersInsure/delete", data), // 根据ID删除保险
	searchInsurePage: (data = {}) =>
		request.get("/app/labourTeamMembersInsure/searchPage", data), // 根据条件查询保险数据集,分页展示
	findInsureById: (data = {}) =>
		request.get("/app/labourTeamMembersInsure/findById", data), // 根据ID查询保险
	searchLabourTeamMembersByOrgId: (data = {}) =>
		request.get("/app/labourTeamMembers/searchByOrgId", data), // 根据条件查询该组织下的劳务人员
	updateInsure: (data = {}) =>
		request.put("/app/labourTeamMembersInsure/update", data), // 根据ID修改保险

	listAllTeamsClass: (data = {}) =>
		request.get("/app/labourTeamMembers/listAllTeamsClass", data), // 查询全部班组类别
	addTeam: (data = {}) => request.post("/app/labourTeamMembers/teamsAdd", data), // 新增班组
	findTeamById: (data = {}) =>
		request.get("/app/labourTeamMembers/teamsById", data), // 根据班组ID查询班组
	deleteTeam: (data = {}) =>
		request.deleter("/app/labourTeamMembers/teamsDelete", data), // 根据班组ID删除班组
	teamsSearchPage: (data = {}) =>
		request.get("/app/labourTeamMembers/teamsSearchPage", data), // 根据条件查询班组，分页展示
	updateTeam: (data = {}) =>
		request.put("/app/labourTeamMembers/teamsUpdate", data), // 根据班组ID修改班组
	addTeamType: (data = {}) =>
		request.post("/app/labourTeamMembers/teamsClassAdd", data), // 新增班组类别
	deleteTeamType: (data = {}) =>
		request.deleter("/app/labourTeamMembers/teamsClassDelete", data), // 根据班组类别ID删除班组类别
	teamsClassFindById: (data = {}) =>
		request.get("/app/labourTeamMembers/teamsClassFindById", data), // 根据班组类别ID查询班组类别
	updateTeamClass: (data = {}) =>
		request.put("/app/labourTeamMembers/teamsClassUpdate", data), // 根据班组类别ID修改班组类别
	searchTemplateByContractType: (data = {}) =>
		request.get("/app/labourContractTemplate/searchByContractType", data), // 查询入职合同模板

	addSettlement: (data = {}) => request.post("/app/labourSettlement/add", data), //新增班组结算发放
	findSettlementById: (data = {}) =>
		request.get("/app/labourSettlement/findById", data), // 根据结算发放ID查询结算发放数据
	teamSearchNoHead: (data = {}) =>
		request.get("/app/labourTeamMembers/teamSearchNoHead", data), // 条件查询班组(排除没有负责人的班组)
	paymentBalanceByTeamId: (data = {}) =>
		request.get("/app/labourSettlement/paymentBalanceByTeamId", data), // 根据班组ID查询支付结余数据集、分页展示
	searchBalance: (data = {}) =>
		request.get("/app/labourSettlement/searchBalance", data), // 条件查询工资支付结余情况
	searchSettlementPage: (data = {}) =>
		request.get("/app/labourSettlement/searchPage", data), // 分页查询结算发放数据集
	terminalAmountByTeamId: (data = {}) =>
		request.get("/app/labourSettlement/terminalAmountByTeamId", data), // 根据班组ID查询上期末结算金额
	updateSettlement: (data = {}) =>
		request.put("/app/labourSettlement/update", data), // 根据ID修改班组结算发放
	withdrawSettlement: (data = {}) =>
		request.put("/app/labourSettlement/withdrawSettlement?pkId=" + data.pkId), // 根据ID撤回结算发放
	deleteSettlement: (data = {}) =>
		request.deleter("/app/labourSettlement/delete", data), // 根据班组ID删除班组

	addLabourContract: (data = {}) =>
		request.post("/app/labourContract/add", data), //新增劳务合同
	cancelContractById: (data = {}) =>
		request.put("/app/labourContract/cancelById?pkId=" + data.pkId), // 根据合同ID作废合同
	findLabourContractById: (data = {}) =>
		request.get("/app/labourContract/findById", data), // 根据ID查询
	nailUrlByOrgId: (data = {}) =>
		request.get("/app/labourContract/nailUrlByOrgId", data), // 根据合同ID获取甲方签署链接
	nailUsersByOrgId: (data = {}) =>
		request.get("/app/labourContract/nailUsersByOrgId", data), // 根据当前登录组织ID获取甲方签署人员
	rescindById: (data = {}) =>
		request.put(
			"/app/labourContract/rescindById?pkId=" +
			data.pkId +
			"&redirectUrl=" +
			data.redirectUrl
		), // 根据合同ID解约合同
	searchLabourContractPage: (data = {}) =>
		request.get("/app/labourContract/searchPage", data), // 条件查询劳务合同数据集，分页展示
	signScheduleById: (data = {}) =>
		request.get("/app/labourContract/signScheduleById", data), // 根据合同ID查询签署进度

	addLabourContractTemplate: (data = {}) =>
		request.post("/app/labourContractTemplate/add", data), //新增劳务合同模板
	deleteTemplate: (data = {}) =>
		request.deleter("/app/labourContractTemplate/delete", data), // 根据ID删除劳务合同模板
	searchContractTemplatePage: (data = {}) =>
		request.get("/app/labourContractTemplate/searchPage", data), // 条件查询合同模板，分页展示
	findContractTemplateById: (data = {}) =>
		request.get("/app/labourContractTemplate/findById", data), // 根据ID查询合同模板
	listAllTemplate: (data = {}) =>
		request.get("/app/labourContractTemplate/listAll", data), // 查询全部合同模板
	updateTemplate: (data = {}) =>
		request.put("/app/labourContractTemplate/update", data), // 修改劳务合同模板
	updateTemplateStatusById: (data = {}) =>
		request.put(
			`/app/labourContractTemplate/updateStatusById?id=${data.id}&status=${data.status}`
		), // 修改劳务合同模板启用状态
	// ************************************* OA管理开始 ******************************************************************************
	oaNoticeAdd: (data = {}) => request.post("/app/oaNotice/add", data), //新增公告信息表数据
	oaNoticeDelete: (data = {}) => request.deleter("/app/oaNotice/delete", data), // 根据ID删除公告信息表
	oaNoticeFindById: (data = {}) => request.get("/app/oaNotice/findById", data), // 待办-根据ID查询公告信息表数据并保存读取记录
	oaNoticeFindNoticeById: (data = {}) =>
		request.get("/app/oaNotice/findNoticeById", data), // 根据ID查询公告信息表数据
	oaNoticeSearch: (data = {}) => request.get("/app/oaNotice/search", data), // 查询首页轮播图
	oaNoticeSearchPage: (data = {}) =>
		request.get("/app/oaNotice/searchPage", data), // 根据条件查询公告信息表，分页展示
	oaNoticeUpdate: (data = {}) => request.put("/app/oaNotice/update", data), // 根据ID修改公告信息表数据
	oaNoticeWithdrawOaNotice: (data = {}) =>
		request.put("/app/oaNotice/withdrawOaNotice?pkId=" + data.pkId), // 根据ID撤回公告信息
	oaMeetingAdd: (data = {}) => request.post("/app/oaMeeting/add", data), //新增会议通知表数据
	oaMeetingCancel: (data = {}) =>
		request.put("/app/oaMeeting/cancel?pkId=" + data.pkId), // 根据ID取消会议通知表
	oaMeetingDelete: (data = {}) =>
		request.deleter("/app/oaMeeting/delete", data), // 根据ID删除会议通知表
	oaMeetingFindById: (data = {}) =>
		request.get("/app/oaMeeting/findById", data), // 根据ID查询会议通知表数据
	oaMeetingHomePage: (data = {}) =>
		request.get("/app/oaMeeting/homePage", data), // 首页的分页查询会议通知
	oaMeetingSearchPage: (data = {}) =>
		request.get("/app/oaMeeting/searchPage", data), // 分页查询会议通知
	oaMeetingUpdate: (data = {}) => request.put("/app/oaMeeting/update", data), // 根据ID修改会议通知表数据
	acceptArticle: (data = {}) =>
		request.put("/app/oaArticle/acceptArticle?pkId=" + data.pkId), // 接收待办里的收发文
	oaArticleAdd: (data = {}) => request.post("/app/oaArticle/add", data), //新增文章表数据
	cooperationCompany: (data = {}) =>
		request.get("/app/oaArticle/cooperationCompany", data), // 分页查询合作单位
	oaArticleDelete: (data = {}) =>
		request.deleter("/app/oaArticle/delete", data), // 根据ID删除文章表
	oaArticleFindById: (data = {}) =>
		request.get("/app/oaArticle/findById", data), // 根据ID查询文章表数据
	oaArticleForward: (data = {}) => request.put("/app/oaArticle/forward", data), // 转发文章
	oaArticleQuoteArticle: (data = {}) =>
		request.get("/app/oaArticle/quoteArticle", data), // 引用文章
	receiveOaArticle: (data = {}) =>
		request.put("/app/oaArticle/receiveOaArticle?pkId=" + data.pkId), // 根据ID接收收文
	searchCompany: (data = {}) =>
		request.get("/app/oaArticle/searchCompany", data), // 条件查询合作单位列表
	oaArticleSearchPage: (data = {}) =>
		request.get("/app/oaArticle/searchPage", data), // 根据条件查询文章表，分页展示
	oaArticleUpdate: (data = {}) => request.put("/app/oaArticle/update", data), // 根据ID修改文章表数据
	waitReceived: (data = {}) => request.get("/app/oaArticle/waitReceived", data), // 获取当前组织的待接收收文数量
	withdrawOaArticle: (data = {}) =>
		request.put("/app/oaArticle/withdrawOaArticle?pkId=" + data.pkId), // 根据ID撤回发文
	sysUserSearch: (data = {}) => request.get("/app/sysUser/search", data), // 条件查询员工数据集
	// ************************************* OA管理结束 ******************************************************************************
	// ************************************* 待办接口开始 ******************************************************************************
	findRenewalByPkId: (data = {}) =>
		request.get("/app/org/findRenewalByPkId", data), // 根据主键(组织或用户)ID查询续期信息
	approveRenewal: (data = {}) => request.put("/app/org/auth", data), // 续期审核
	findSmsSignByPkId: (data = {}) => request.get("/app/smsSign/findById", data), // 根据ID查询短信签名数据
	approveSmsSign: (data = {}) => request.put("/app/smsSign/approve", data), // 审批短信签名
	findSmsRechargeByPkId: (data = {}) =>
		request.get("/app/sysSmsRecharge/findById", data), // 根据ID查询短信签名数据
	approveSmsRecharge: (data = {}) =>
		request.put("/app/sysSmsRecharge/approve", data), // 审批短信签名
	getPartyBUrl: (data = {}) =>
		request.get("/app/labourContract/getPartyBUrl", data), // 根据合同ID获取乙方签署链接
	getMatterNum: (data = {}) => request.get("/app/user/getMatterNum", data), // 查询消息列表数量
	// ************************************* 待办接口结束 ******************************************************************************
	getCompanyDate: (data = {}) =>
		request.get("/app/public/getCompanyDate", data), // 获取公司基本信息
	getWorkflowDetail: (data = {}) =>
		request.get("/app/prodProcessApprove/getWorkflowDetail", data), // 查询流程详情
	authorization: (data = {}) =>
		request.post("/app/enterprise/authorization", data), //app授权认证
	// ************************************* 状态码结开始 ******************************************************************************
	searchSettleStates: (data = {}) =>
		request.get("/app/statsProjectSettle/searchSettleStates", data), //查询计量管理状态数据集
	searchOrderInventoryStates: (data = {}) =>
		request.get("/app/orderInventory/searchOrderInventoryStates", data), //查询盘点单状态数据集
	searchProcessApproveStates: (data = {}) =>
		request.get("/app/prodProcessApprove/searchProcessApproveStates", data), //查询施工验收状态数据集
	// ************************************* 状态码结结束 ******************************************************************************
	// ************************************* 流程查看开始 ******************************************************************************
	searchByBusinessNode: (data = {}) =>
		request.get("/app/workflowSeal/searchByBusinessNode", data), //根据业务ID和节点ID查询审批信息
	// ************************************* 流程查看结束 ******************************************************************************
	getAllCanViewMenu: (data = {}) =>
		request.get("/app/sysRole/getAllCanViewMenu", data), //查询所有可查看数据菜单
	getAllDept: (data = {}) => request.get("/app/sysRole/allDept", data), //查询该公司下所有的部门以及部门下的员工
	searchMenuDataAuthorize: (data = {}) =>
		request.get("/app/public/searchMenuDataAuthorize", data), //获取当前登录用户角色关联菜单权限数据集
	// *************************************库存管理开始***********************************************************************************
	orderOutApplyPage: (data = {}) =>
		request.get("/app/orderOutApply/searchPage", data), //根据条件查询物资出库申请单，分页展示
	orderOutApplyAdd: (data = {}) => request.post("/app/orderOutApply/add", data), //新增物资出库申请单数据
	orderOutApplyUpdate: (data = {}) =>
		request.put("/app/orderOutApply/update", data), //根据ID修改物资出库申请单数据
	orderOutApplyDelete: (data = {}) =>
		request.deleter("/app/orderOutApply/delete", data), // 根据ID删除物资出库申请单
	orderOutApplyFindById: (data = {}) =>
		request.get("/app/orderOutApply/findById", data), //根据ID查询物资出库申请单数据
	updateApplyCode: (data = {}) =>
		request.put("/app/orderOutApply/updateApplyCodeByBusinessType", data), // 根据主键ID和业务类型修改物资申请单状态
	findDictBySupplyType: (data = {}) =>
		request.get("/app/orderOutApply/findDictBySupplyType", data), // 物资出库申请单获取出库对象
	findDictProjectId: (data = {}) =>
		request.get("/app/orderOutApply/findApplyPurchaseOrderByProjectId", data), // 根据标段项目ID查询采购计划单列表-供应商出库申请专用
	searchOrderOutApply: (data = {}) =>
		request.get("/app/inventory/out/searchOrderOutApply", data), // 条件查询供货申请单出库物料数据集
	findOrderOutApplyBySource: (data = {}) =>
		request.get("/app/inventory/out/findOrderOutApplyBySource", data), // 根据出库对象获取物资出库申请单下拉列表
	// *************************************库存管理结束***********************************************************************************
	findWorkAreaStats: (data = {}) =>
		request.get(
			"/app/projProject/findWorkAreaStats?projectId=" + data.projectId
		), // 获取项目部的工区启用状态
	getUserAuthorizeByRoleId: (data = {}) =>
		request.get(
			"/app/sysUser/getUserAuthorizeByRoleId?roleIds=" + data.roleIds
		), // 通过roleId查詢用戶数据权限
	noTokenFaceSwiping: (data = {}) =>
		request.post("/app/user/personAuthorization", data), // 个人授权认证获取链接
	findWorkAreaStats: (data = {}) =>
		request.get("/app/projProject/findWorkAreaStats?fkOrgId=" + data), // 获取项目部的工区启用状态
	getUserAuthorizeByRoleId: (data = {}) =>
		request.get(
			"/app/sysUser/getUserAuthorizeByRoleId?roleIds=" + data.roleIds
		), // 通过roleId查詢用戶数据权限
	withdrawalProcessingNodeGit: (data = {}) =>
		request.put(
			"/app/prodProcessApprove/withdrawalProcessingNode", data
		), // 撤回流程节点
	//******************************************************************部门管理**************************************************************************************** */
	newDepartment: (data = {}) => request.put("/app/sysDept", data), // 新增部门
	newDepartmentADD: (data = {}) => request.post("/app/sysDept", data), // 新增部门
	getDepart: (data = {}) => request.get("/app/sysDept", data), // 根据部门主键id查询部门信息
	uploadPicture: (data = {}) => request.post("/app/file/upload/picture", data), //文件上传
	deptListByOrgId: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/deptListByOrgId", data), // 查询当前登录组织下的所有部门和员工
	searchUserByOrderApply: (data = {}) =>
		request.get("/app/sysUser/searchUserByOrderApply", data), // 申请单专用员工下拉列表
	orderPurchaseDelete: (data = {}) =>
		request.deleter("/app/orderPurchase/delete", data), // 根据ID删除物资采购单
	projectListByOrgId: (data = {}) =>
		request.get("/app/prodTechnicalDisclosure/projectListByOrgId", data), // 获取建设单位、监理公司和设计院的所有关联项目部（含下属部门和员工）
	searchDeviceClass: (data = {}) =>
		request.get("/app/projCostManage/searchDeviceClass", data), //
	prodConstructionJournalDelete: (data = {}) =>
		request.deleter("/app/prodConstructionJournal/delete", data), // 根据ID删除施工日志
	selectByThreeId: (data = {}) =>
		request.get("/app/statsQualityEvaluate/selectByThreeId", data), //
	getSearchItemsByProjectId: (data = {}) =>
		request.get("/app/statsQualitySafetyDaily/searchItemsByProjectId", data), //根据项目部查询树形分项工程集(员工登录只查员工管理的)
	userSearch: (data = {}) => request.get("/app/oaArticle/userSearch", data), // 条件查询员工数据集
	searchByDept: (data = {}) => request.get("/app/sysRole/searchByDept", data), // 查询当前登录组织的所有角色列表
	labourInfo: (data = {}) => request.get("/app/user/labourInfo", data), // 查询劳务工人的个人信息
	//******************************************************************1007版本新增接口**************************************************************************************** */
	getOrgSealState: (data = {}) =>
		request.get("/app/public/getOrgSealState", data), // 检查企业实名或者授权状态
	getTwoCode: (data = {}) => request.get("/app/public/getTwoCode", data), // 根据用户ID获取实名认证链接
	prodTechnicalDisclosureDelete: (data = {}) =>
		request.deleter("/app/prodTechnicalDisclosure/delete", data), // 根据ID删除技术交底
	prodTechnicalDisclosureUpdate: (data = {}) =>
		request.put("/app/prodTechnicalDisclosure/update", data), // 根据ID修改技术交底
	orderPurchaseUpdate: (data = {}) =>
		request.put("/app/orderPurchase/update", data), // 根据ID修改物资采购单数据
	prodProcessApproveDelete: (data = {}) =>
		request.deleter("/app/prodProcessApprove/delete", data), // 删除生产审批流程
	//******************************************************************1016版本新增接口**************************************************************************************** */
	updateTeamSettlement: (data = {}) =>
		request.post("/app/labourSettlement/updateTeamSettlement", data), // 班组长编辑结算发放
	approvalMatterSearchPage: (data = {}) =>
		request.get("/app/org/approvalMatterSearchPage", data), //审批事项分页查询
	summaryStandSearch: (data = {}) =>
		request.get("/app/finance/summaryStandSearch", data), //财务管理-供应商结算-汇总台账
	subLedgerAmountSearchPage: (data = {}) =>
		request.get("/app/finance/subLedgerAmountSearchPage", data), //财务管理-分包商结算-汇总台账
	projFinanceIntercourse: (data = {}) =>
		request.get("/app/projFinanceIntercourse/searchPage", data), //根据条件查询往来账表，分页展示
	getSelfMaterialTypes: (data = {}) =>
		request.get("/app/materialInventory/getSelfMaterialTypes", data), //查询仓库下面的物料类型
	validateTelephoneIsAccess: (data = {}) =>
		request.get("/app/user/validateTelephoneIsAccess", data), //校验手机号是否本人
	getUserList: (data = {}) => request.get("/app/user/getUserList", data), //修改手机号码时获取账号列表
	validateModifyTelephone: (data = {}) =>
		request.get("/app/user/validateModifyTelephone", data), //修改手机号码时校验账号是否符合规范
	modifyTelephone: (data = {}) =>
		request.put("/app/user/modifyTelephone", data), // 修改手机号码
	findCheckByInputId: (data = {}) =>
		request.get("/app/inventory/findByInputId", data), // 入库查询检测信息
	retractCopy: (data = {}) =>
		request.post("/app/prodTechnicalDisclosure/retractCopy", data), // 撤回抄送
	windGradeAllList: (data = {}) =>
		request.get("/app/prodConstructionJournal/windGradeAllList", data), // 查询所有风力等级列表
	// ******************************************************************1117版本新增接口***************************************************************
	getlabourInfo: (data = {}) =>
		request.get("/app/labourTeamMembers/labourInfo", data), // 查看组内人员详情
	getSettleInfo: (data = {}) =>
		request.post("/app/statsProjectSettle/getSettleInfo", data), // 获取结算详情
	searchContracts: (data = {}) =>
		request.get("/app/projContract/searchContracts", data), // 根据条件查询合同
	updateQRCode2: (data = {}) => request.get("/eng/public/updateQRCode", data), //根据唯一标识修改二维码的扫码状态为已扫码
	projectSummaryPie: (data = {}) =>
		request.get("/app/projSummaryReality/projectSummaryPie", data), //项目部查询进度汇总(饼图)
	projectDetailPie: (data = {}) =>
		request.get("/app/projSummaryReality/projectDetailPie", data), //项目部查询工区或分包单位各清单占比(饼图)
	// 根据合同ID获取甲方签署链接
	nailUrlByOrgId2: (data = {}) => request.get("/app/user/nailUrlByOrgId", data), //待办根据合同ID获取甲方签署链接
	getPartyBUrl2: (data = {}) => request.get("/app/user/getPartyBUrl", data), //待办根据合同ID获取乙方签署链接
	getSettleSummary: (data = {}) =>
		request.get("/app/projSummaryReality/settleSummary", data), //计量汇总接口
	// ******************************************************************1219版本新增接口***************************************************************
	getProjectTreeByOrgType: (data = {}) =>
		request.get("/app/public/getProjectTreeByOrgType", data), //获取当前组织所有项目树形集合
	searchSignPage: (data = {}) => request.get("/app/oaSeal/searchPage", data), //根据条件搜索文件用章,分页展示
	searchSuperiorOrg: (data = {}) =>
		request.get("/app/superiorOrg/searchSuperiorOrg", data), //查询上级单位
	bindingSuperior: (data = {}) =>
		request.post("/app/superiorOrg/binding", data), //绑定上级单位客户数据
	secureBinding: (data = {}) =>
		request.put(
			"/app/superiorOrg/secureBinding?customId=" + data.customId,
			data
		), //解除绑定上级单位客户数据
	searchSuperiorOrgByLinkPhone: (data = {}) =>
		request.get("/app/superiorOrg/searchSuperiorOrgByLinkPhone", data), //根据管理员手机号准确查询上级单位
	contractDetailExportFile2: (data = {}) =>
		request.get("/app/contractInfo/contractDetailExportFile", data), //合同清单表格导出
	contractDetailsByContractId2: (data = {}) =>
		request.get("/app/contractInfo/contractDetailsByContractId", data), //根据合同ID查询合同清单数据集
	contractSupplyMaterialSearch2: (data = {}) =>
		request.get("/app/contractInfo/contractSupplyMaterialSearch", data), //条件查询合同供应材料数据集
	findContractById2: (data = {}) =>
		request.get("/app/contractInfo/findContractById", data), //根据合同ID查询合同信息
	searchContract: (data = {}) => request.get("/app/contractInfo/search", data), //根据条件查询合同数据集
	searchMaterialTypeByContractId: (data = {}) =>
		request.get("/app/contractInfo/searchMaterialTypeByContractId", data), //根据合同ID查询合同清单物料分类数据集
	projectSearchPage: (data = {}) =>
		request.get("/app/projectInfo/projectSearchPage", data), //分页查询项目
	projectTableSearchPage: (data = {}) =>
		request.get("/app/projectInfo/projectTableSearchPage", data), //分页查询工程项目
	searchProjectTechnicalDisclosure: (data = {}) =>
		request.get("/app/projectTechnicalDisclosure/search", data), //项目管理-根据条件查询技术交底，分页展示
	findDisclosureById: (data = {}) =>
		request.get("/app/projectTechnicalDisclosure/findById", data), //项目管理-根据ID查询技术交底
	updateEnableStatus2: (data = {}) =>
		request.post("/app/projectTechnicalDisclosure/updateEnableStatus", data), //项目管理-根据ID接收或撤回技术交底
	carbonCopy2: (data = {}) =>
		request.post("/app/projectTechnicalDisclosure/copy", data), //项目管理-抄送技术交底
	retractCopy2: (data = {}) =>
		request.post("/app/projectTechnicalDisclosure/retractCopy", data), //项目管理-撤回抄送
	addProjectTechnicalDisclosure: (data = {}) =>
		request.post("/app/projectTechnicalDisclosure/add", data), //项目管理-新增技术交底
	delProjectTechnicalDisclosure: (data = {}) =>
		request.deleter("/app/projectTechnicalDisclosure/delete", data), //项目管理-根据ID删除技术交底
	updateProjectTechnicalDisclosure: (data = {}) =>
		request.put("/app/projectTechnicalDisclosure/update", data), //项目管理-根据ID修改技术交底
	searchProject: (data = {}) => request.get("/app/public/searchProject", data), //获取当前组织的所有项目数据集
	projectBidByProjectId: (data = {}) =>
		request.get("/app/public/projectBidByProjectId", data), //根据项目ID查询关联标段项目数据集
	findStatsProjectSettleById: (data = {}) =>
		request.get("/app/projectSettlement/findStatsProjectSettleById", data), //项目管理-根据ID查看结算信息
	searchSettlePage: (data = {}) =>
		request.get("/app/projectSettlement/searchPage", data), //项目管理-上级单位分页展示搜索项目计量
	withdrawalSettle: (data = {}) =>
		request.put(
			"/app/projectSettlement/withdrawalProcessingNode?settleId=" +
			data.settleId,
			data
		), //项目管理-撤回流程节点
	projectExamine2: (data = {}) =>
		request.put("/app/projectSettlement/projectExamine", data), //项目管理-撤回流程节点
	searchProcessCheckPage: (data = {}) =>
		request.get("/app/projectProcessCheck/searchPage", data), //施工验收分页列表
	findProcessApproveById: (data = {}) =>
		request.get("/app/projectProcessCheck/findProcessApproveById", data), //根据ID查询生产流程
	processingNodeApproval: (data = {}) =>
		request.put("/app/projectProcessCheck/processingNodeApproval", data), //处理流程节点
	withdrawalProcessingNode2: (data = {}) =>
		request.put(
			"/app/projectProcessCheck/withdrawalProcessingNode?approveId=" +
			data.approveId,
			data
		), //撤回流程节点
	updateDesign: (data = {}) =>
		request.put("/app/changesDesignInfo/update", data), //修改变更设计
	changeStatsQuery2: (data = {}) =>
		request.get("/app/changesDesignInfo/changeStatsQuery", data), //修改变更设计
	getChangeType2: (data = {}) =>
		request.get("/app/changesDesignInfo/getChangeType", data), //查询设计变更流程列表
	getCreateUserList2: (data = {}) =>
		request.get("/app/changesDesignInfo/getCreateUserList", data), //查询发起人列表
	getDetail: (data = {}) =>
		request.get("/app/changesDesignInfo/getDetail", data), //查询设计变更详情
	getChangeWorkflowDetail2: (data = {}) =>
		request.get("/app/changesDesignInfo/getWorkflowDetail", data), //查询流程详情
	getChangeWorkflowTable2: (data = {}) =>
		request.get("/app/changesDesignInfo/getWorkflowTable", data), //获取设计变更的表格
	approvalProcess2: (data = {}) =>
		request.get("/app/changesDesignInfo/approvalProcess", data), //审批流程
	searchDesignPage: (data = {}) =>
		request.get("/app/changesDesignInfo/searchPage", data), //分页查询设计变更
	withdrawDesignActivity2: (data = {}) =>
		request.post(
			"/app/changesDesignInfo/withdrawActivity?changeId=" + data.changeId,
			data
		), //撤回设计变更流程
	searchCustom: (data = {}) =>
		request.get("/app/appCustomInfo/searchCustom", data), //条件查询客户列表
	findCustomById: (data = {}) =>
		request.get("/app/appCustomInfo/findCustomById", data), //根据ID查询客户数据
	getChildOrg: (data = {}) =>
		request.get("/app/jurisdictionalOrg/getChildOrg", data), //获取子单位
	jurisdictionalOrg: (data = {}) =>
		request.get("/app/jurisdictionalOrg/getUserList", data), //获取子单位人员
	searchContractPage: (data = {}) =>
		request.get("/app/summaryContract/searchPage", data), //查询合同汇总分页
	contractPie: (data = {}) =>
		request.get("/app/summaryContract/contractPie", data), //查询合同金额所占饼图和汇总金额
	findContractById3: (data = {}) =>
		request.get("/app/summaryContract/findContractById", data), //根据合同ID查询合同信息
	searchSummaryContract: (data = {}) =>
		request.get("/app/summaryContract/search", data), //根据标段项目查询施工合同列表
	planPie: (data = {}) => request.get("/app/summaryPlan/planPie", data), //查询计划产值所占饼图和汇总产值
	searchPlanPage: (data = {}) =>
		request.get("/app/summaryPlan/searchPage", data), //查询计划汇总分页
	searchPlanAndDetail2: (data = {}) =>
		request.get("/app/summaryPlan/searchPlanAndDetail", data), //根据条件查询计划及计划明细
	searchActual: (data = {}) =>
		request.get("/app/summaryPlan/searchActual", data), //根据条件查询实际完成
	getSummaryAmount: (data = {}) =>
		request.get("/app/costSummary/getSummaryAmount", data), //成本汇总详情加饼图
	searchCostPage: (data = {}) =>
		request.get("/app/costSummary/searchPage", data), //成本汇总分页
	getSettleSummaryAmount: (data = {}) =>
		request.get("/app/settleSummary/getSummaryAmount", data), //计量数据合计
	searchSettlePage2: (data = {}) =>
		request.get("/app/settleSummary/searchPage", data), //计量数据分页
	financePie: (data = {}) =>
		request.get("/app/summaryFinance/financePie", data), //查询财务金额所占饼图和汇总金额
	searchFinancePage: (data = {}) =>
		request.get("/app/summaryFinance/searchPage", data), //查询财务汇总分页
	searchRealityPage: (data = {}) =>
		request.get("/app/superiorSummaryReality/searchPage", data), //上级单位分页查询进度汇总
	superiorSummary: (data = {}) =>
		request.get("/app/superiorSummaryReality/superiorSummary", data), //上级单位查询进度汇总金额
	financeSearchPage: (data = {}) =>
		request.get("/app/summaryFinance/financeSearchPage", data), //财务管理-供应商结算/分包商结算
	findFinanceById: (data = {}) =>
		request.get("/app/summaryFinance/findById", data), //根据ID查询往来账表数据
	approveExamineStatsQuery: (data = {}) =>
		request.get(
			"/app/prodItemApprovalRecordInfo/approveExamineStatsQuery",
			data
		), //查询流程审批状态列表
	searchExaminePage: (data = {}) =>
		request.get("/app/prodItemApprovalRecordInfo/searchPage", data), //根据条件查询流程审批记录表，分页展示
	findExamineById: (data = {}) =>
		request.get("/app/prodItemApprovalRecordInfo/findById", data), //根据ID查询审批记录表数据
	approveExamine: (data = {}) =>
		request.put("/app/prodItemApprovalRecordInfo/approveExamine", data), //批量审批流程审批记录
	searchCompanyRole: (data = {}) =>
		request.get("/app/oaArticle/searchCompanyRole", data), //根据ID查询审批记录表数据
	subsetOrgList: (data = {}) => request.get("/app/sysUser/subsetOrgList", data), //获取管理单位下拉列表
	appCustomSearchCustom: (data = {}) =>
		request.get("/app/appCustom/searchCustom", data), //条件查询客户列表
	delChangesDesign: (data = {}) =>
		request.deleter("/app/prodChangesDesign/delete", data), // 根据ID删除设计变更
	delChangesDesign2: (data = {}) =>
		request.deleter("/app/changesDesignInfo/delete", data), // 根据ID删除设计变更
	itemList: (data = {}) => request.get("/app/sysUser/itemList", data), //获取管理单位下拉列表
	addProjectTable: (data = {}) =>
		request.post("/app/projProjectTable/addProjectTable", data), //新增工程项目数据
	updateProjectTable: (data = {}) =>
		request.put("/app/projProjectTable/updateProjectTable", data), //根据ID修改工程项目数据
	deleteProjectTable: (data = {}) =>
		request.deleter("/app/projProjectTable/deleteProjectTable", data), // 根据ID删除工程项目
	projectAddProjectTable: (data = {}) =>
		request.post("/app/projectInfo/addProjectTable", data), //新增工程项目数据
	projectUpdateProjectTable: (data = {}) =>
		request.put("/app/projectInfo/updateProjectTable", data), //根据ID修改工程项目数据
	projectDeleteProjectTable: (data = {}) =>
		request.deleter("/app/projectInfo/deleteProjectTable", data), // 根据ID删除工程项目
	addProject: (data = {}) => request.post("/app/projectInfo/addProject", data), //addProject
	updateProject: (data = {}) =>
		request.put("/app/projectInfo/updateProject", data), //根据ID修改项目信息
	deleteProject: (data = {}) =>
		request.deleter("/app/projectInfo/deleteProject", data), // 根据ID删除工程项目
	getItemListNoUserId: (data = {}) =>
		request.get("/app/projProject/getItemListNoUserId", data), //获取当前组织的所有项目数据集
	provinceList: (data = {}) =>
		request.get("/operation/sysArea/provinceList", data), //省份列表
	cityList: (data = {}) => request.get("/operation/sysArea/cityList", data), //市级列表
	areaList: (data = {}) => request.get("/operation/sysArea/areaList", data), //地区列表
	availableTelephone: (data = {}) => request.get("/app/sysUser/availableTelephone",
		data), //查询账号是否已有人引用 false:无 true:有
	searchStatsItemFinishFile: (data = {}) => request.get("/app/statsItemFinishRecordTable/searchStatsItemFinishFile",
		data), //根据标段项目ID(非项目部身份登录需要传)查询档案库数据集
	addStatsItem: (data = {}) => request.post("/app/statsItemFinishRecordTable/add", data), //新增分项工程完成记录动态表数据
	statsItemDeleteBatch: (data = {}) => request.deleter("/app/statsItemFinishRecordTable/deleteBatch",
		data), // 根据主键ID集批量删除分项工程完成记录动态表数据
	batchDownloadItemFinishRecordTable: (data = {}) => request.post(
		"/app/statsItemFinishRecordTable/batchDownloadItemFinishRecordTable", data), //批量下载(导出)档案文件
	batchPutItemFinishRecordTable: (data = {}) => request.post(
		"/app/statsItemFinishRecordTable/batchPutItemFinishRecordTable", data), //批量打印档案文件
	projDeviceSearchPage: (data = {}) => request.get("/app/projDevice/searchPage", data), //根据条件查询设备表，分页展示
	projDeviceAdd: (data = {}) => request.post("/app/projDevice/add", data), //新增设备表数据
	searchByTree: (data = {}) => request.get("/app/projDevice/searchByTree", data), //查询所有设备类别并成树形
	projDeviceFindById: (data = {}) => request.get("/app/projDevice/findById", data), //根据ID查询设备表数据
	deviceTemplateSearchPage: (data = {}) => request.get("/app/projDevice/deviceTemplateSearchPage",
	data), //根据ID查询设备表数据
	projDeviceUpdate: (data = {}) => request.put("/app/projDevice/update", data), //根据ID修改设备表数据
	projDeviceDelete: (data = {}) => request.deleter("/app/projDevice/delete", data), // 根据ID删除设备表
	projDeviceDeptList: (data = {}) => request.get("/app/projDevice/deptList", data), //查询当前登录组织下的所有部门和该项目部所辖项目的分项工程集
	projDeviceSearchDeptList: (data = {}) => request.get("/app/projDevice/searchDeptList", data), //查询当前登录组织下的所有部门
	projProjectUpdate: (data = {}) => request.put("/app/projProject/update", data), //根据ID修改项目信息
	searchContractItems: (data = {}) => request.get("/app/projContract/searchContractItems",
		data), //查询合同清单里符合条件的分项工程细目数据集
	delCon: (data = {}) => request.deleter("/app/projContract/delete", data), //根据ID删除合同
	terminationConstant: (data = {}) => request.put("/app/projContract/terminationConstant?pkId=" + data.pkId,
		data), //根据ID终止合同
	delCon2: (data = {}) => request.deleter("/app/contractInfo/delete", data), //根据ID删除合同
	terminationConstant2: (data = {}) => request.put("/app/contractInfo/terminationConstant?pkId=" + data.pkId,
		data), //根据ID终止合同
	searchMajorTypeList: (data = {}) => request.get("/app/contractInfo/searchMajorTypeList",
		data), //查询专业类别下拉列表并根据合同所需分项工程集过滤
	searchItemDetailByOrgId: (data = {}) => request.get("/app/projContract/searchItemDetailByOrgId",
		data), //根据条件查询生产设置的分项清单细目数据集
	searchItemDetailByOrgId2: (data = {}) => request.get("/app/contractInfo/searchItemDetailByOrgId",
		data), //根据条件查询生产设置的分项清单细目数据集
	searchContractItems2: (data = {}) => request.get("/app/projContract/searchContractItems",
		data), //查询合同清单里符合条件的分项工程细目数据集
	searchContractItems3: (data = {}) => request.get("/app/contractInfo/searchContractItems",
		data), //查询合同清单里符合条件的分项工程细目数据集
	unitSearch: (data = {}) => request.get("/app/projContract/unitSearch", data), //根据条件查询单位列表
	addCon: (data = {}) => request.post("/app/projContract/add", data), //新增合同
	addCon2: (data = {}) => request.post("/app/contractInfo/add", data), //新增合同
	editCon: (data = {}) => request.put("/app/projContract/update", data), //编辑合同
	editCon2: (data = {}) => request.put("/app/contractInfo/update", data), //编辑合同
	searchMaterialTypes: (data = {}) => request.get("/app/projContract/searchMaterialTypes",
		data), //查询当前登录项目部分项工程关联物料分类数据集(带下属物料数据集)
	searchBuildByOrgId: (data = {}) => request.get("/app/contractInfo/searchBuildByOrgId",
		data), //查询当前登录项目部分项工程关联物料分类数据集(带下属物料数据集)
	allListBidByOrgId: (data = {}) => request.get("/app/projectInfo/allListBidByOrgId", data), //查询关联的项目标段
	addProjectBid: (data = {}) => request.post("/app/projectInfo/addProjectBid", data), //查询关联的项目标段
	getfindProjectById: (data = {}) => request.get("/app/projectInfo/findProjectById", data), //根据ID查询项目信息
	delSettle: (data = {}) => request.deleter("/app/statsProjectSettle/delete", data), // 根据ID删除结算
	searchCompleteItemName: (data = {}) => request.get("/app/prodProcessApprove/searchCompleteItemName",
		data), //根据ID查询项目信息
	getFaceAuthStatus: (data = {}) => request.get("/app/public/findUserApproveStatus",
		data), //获取认证状态，判断是否需要弹出核身 0:不需要 1:需要
	updateQRCodeData: (data = {}) => request.put("/app/public/updateQRCodeData", data), //更新人脸识别状态
	scanQRCode: (data = {}) => request.get("/app/enterprise/scanQRCode", data), //根据唯一标识修改二维码的扫码状态为已扫码
	judgeScanCompleted: (data = {}) => request.get("/app/public/judgeScanCompleted", data), //根据唯一标识修改二维码的扫码状态为已扫码

};
export default api;
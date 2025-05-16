<template>
  <div class="list" ref="fixedHeader">
    <div class="fixed-container">
      <gni-nav-bar :isShowNav="false"></gni-nav-bar>
      <div class="header">
        <div class="icon-return" @click="onClickBack">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_reutrn.png'" alt="">
        </div>
        <div class="header-input" @click="toolsGoPageView({path:'/home/newsearch'})">
          <input type="text" v-model="searchInputkeyword" placeholder="请输入小区/路段名称">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchbig.png'" alt="" class="icon-magnifier">
        </div>
      </div>
      <div class="house-type-box" v-show="salePostGetData.isShowBox && newhousePostGetData.isShowBox">
        <div class="house-type-container">
          <div class="house-type-item" v-for="item in houseType" :key="item.id" @click="changeHouse(item.id,true)"
            :style="{'background':houseTypeIndex==item.id?'#ffce09':'#FFFFFF'}">
            <img :src="$appConfig.appWebStaticUrl + `/home/${houseTypeIndex==item.id?item.selecticon:item.icon}.png`" alt=""
              class="icon-housetype">
            <div class="house-name" :style="{'color':houseTypeIndex==item.id?'#FFFFFF':'#000000'}">{{item.id==1?searchHouseTypeIndex==0?'二手房':'租房':item.name}}</div>
          </div>
        </div>
        <div class="split-line"></div>
      </div>
    </div>
    <div class="fixed-box" :style="{'height':navheight+'px'}"></div>
    <div class="house-sale-box"
      v-show="dealPostGetData.isShowBox">
      <!-- 在售房源标签 -->
      <div class="house-sale-deal">
        <div class="saledeal-item" @click="changeSaleDeal(1)" :style="{'fontWeight':saleDealIndex==1?'bold':'400'}">
          {{'在'+(searchHouseTypeIndex==0?'售':'租')+'房源('+salePostGetData.total+')'}}
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="saleDealIndex==1">
        </div>
        <div class="saledeal-item" @click="changeSaleDeal(2)" :style="{'fontWeight':saleDealIndex==2?'bold':'400'}">
          历史成交({{dealPostGetData.total}})
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="saleDealIndex==2">
        </div>
      </div>
    </div>
    <!-- 二手房，租房的列表容器 -->
    <div class="sale-box" ref="saleContainer" v-show="saleDealIndex==1 && salePostGetData.isShowBox">
      <div class="house-title" v-show="searchHouseTypeIndex==0 && rentList.length==0 && newHouseList.length==0 && dealHouseList.length==0">二手房：</div>
      <div class="house-title" v-show="searchHouseTypeIndex==1 && saleList.length==0 && newHouseList.length==0 && dealHouseList.length==0">租房：</div>
      <van-sticky :container="saleContainer" :offset-top="navheight-10">
        <div class="screen-box">
          <div class="search-condition">
            <van-dropdown-menu active-color="#000000" :close-on-click-outside="false">
              <van-dropdown-item :title="salePostGetData.titleDistrict" ref="district" :title-class="districtClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-region">
                  <div class="region-content">
                    <div class="region-left">
                      <ul>
                        <li @click="selectTabArea(0,'district','saleRenTab')" :class="salePostGetData.tabAreaIndex == 0 ? 'more-active':''">区域</li>
                        <li @click="selectTabArea(1,'district','saleRenTab')" :class="salePostGetData.tabAreaIndex == 1 ? 'more-active':''" v-if="districtMetro.length>1">地铁</li>
                      </ul>
                    </div>
                    <template v-if="salePostGetData.tabAreaIndex == 0">
                      <div class="region-middle">
                        <ul>
                          <li v-for="(item,index) in district" :key="index" :class="salePostGetData.setDistrict && salePostGetData.setDistrict.hasOwnProperty('id') && salePostGetData.setDistrict.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'saleRenTab')">{{item.name}}</li>
                        </ul>
                      </div>
                      <div class="region-right" ref="scrollRight">
                        <ul>
                          <li v-for="(item,index) in addresslist" :key="index" @click="chooseDistrictAddress(item,'district',false,'saleRenTab')">
                            <span :class="checkArrayValue(salePostGetData.setDistrictList,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(salePostGetData.setDistrictList,'id',item.id)==-1">
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                          </li>
                        </ul>
                      </div>
                    </template>
                    <template v-if="salePostGetData.tabAreaIndex == 1">
                      <div class="region-middle">
                        <ul>
                          <li v-for="(item,index) in districtMetro" :key="index" :class="salePostGetData.setDistrictMetro && salePostGetData.setDistrictMetro.hasOwnProperty('id') && salePostGetData.setDistrictMetro.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'saleRenTab')">{{item.name}}</li>
                        </ul>
                      </div>
                      <div class="region-right" ref="scrollRight">
                        <ul>
                          <li v-for="(item,index) in addresslistMetro" :key="index" @click="chooseDistrictAddress(item,'district',false,'saleRenTab')">
                            <span :class="checkArrayValue(salePostGetData.setDresslistMetro,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(salePostGetData.setDresslistMetro,'id',item.id)==-1">
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                          </li>
                        </ul>
                      </div>
                    </template>

                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('district','saleRenTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('district',true,'saleRenTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="salePostGetData.titlePrice" ref="priceTab" :title-class="priceTabClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-price house-type">
                  <div class="price-tab">
                    <div class="tab-first" @click="selectTabArea(0,'priceTab','saleRenTab')" :class="salePostGetData.tabPriceIndex == 0?'price-tab-active':''">{{searchHouseTypeIndex==0?'总价 (万/套)':'租金(元)'}}</div>
                    <div class="tab-second" @click="selectTabArea(1,'priceTab','saleRenTab')" :class="salePostGetData.tabPriceIndex == 1?'price-tab-active':''" v-show="searchHouseTypeIndex==0">单价 (万/㎡)</div>
                  </div>
                  <template v-if="salePostGetData.tabPriceIndex == 0">
                    <div class="type-content price-content" v-show="searchHouseTypeIndex==0">
                      <div class="type-item" v-for="(item,index) in priceTabFirst" :key="index" @click="chooseDistrictAddress(item,'priceTab',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setPriceTabFirst,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                    </div>
                    <div class="type-content price-content" v-show="searchHouseTypeIndex==1">
                      <div class="type-price" v-for="(item,index) in priceTabFirst" :key="index" @click="chooseDistrictAddress(item,'priceTab',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setPriceTabFirst,'id',item.id) != -1?'type-active-price':''">{{item.name}}</div>
                    </div>
                    <div class="price-ipt">
                      <input type="number" class="_iosKeyboardInput" v-model="salePostGetData.setPriceFirstVal[0]" :placeholder="'最低总价('+(searchHouseTypeIndex==0?'万':'元')+')'" @keyup="checkPriceInput(0,'saleRenTab')">
                      <span>至</span>
                      <input type="number" class="_iosKeyboardInput" v-model="salePostGetData.setPriceFirstVal[1]" :placeholder="'最高总价('+(searchHouseTypeIndex==0?'万':'元')+')'" @keyup="checkPriceInput(1,'saleRenTab')">
                    </div>
                  </template>
                  <template v-if="salePostGetData.tabPriceIndex == 1">
                    <div class="type-content price-content">
                      <div class="type-item" v-for="(item,index) in priceTabSecond" :key="index" @click="chooseDistrictAddress(item,'priceTab',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setPriceTabSecond,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                    </div>
                    <div class="price-ipt">
                      <input type="number" class="_iosKeyboardInput" v-model="salePostGetData.setPriceSecondVal[0]" placeholder="最低单价(万)" @keyup="checkPriceInput(0,'saleRenTab')">
                      <span>至</span>
                      <input type="number" class="_iosKeyboardInput" v-model="salePostGetData.setPriceSecondVal[1]" placeholder="最高单价(万)" @keyup="checkPriceInput(1,'saleRenTab')">
                    </div>
                  </template>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div @click="resetFunciton('priceTab','saleRenTab')" class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('priceTab',true,'saleRenTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="salePostGetData.titleArea" ref="area" :title-class="areaClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in moreArea" :key="index" @click="chooseDistrictAddress(item,'area',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setMoreArea,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="price-ipt" v-show="searchHouseTypeIndex==1">
                    <input type="number" class="_iosKeyboardInput" v-model="salePostGetData.setAreaFirstVal" placeholder="最小面积（㎡）">
                    <span>至</span>
                    <input type="number" class="_iosKeyboardInput" v-model="salePostGetData.setAreaLastVal" placeholder="最大面积（㎡）">
                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('area','saleRenTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('area',true,'saleRenTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="salePostGetData.titleHuxing" ref="huxing" :title-class="huxingClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in huxing" :key="index" @click="chooseDistrictAddress(item,'huxing',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setHuxing,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('huxing','saleRenTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('huxing',true,'saleRenTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="salePostGetData.titleMore" ref="moreTitle" :title-class="moreTitleClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-more">
                  <div class="more-content">
                    <div class="more-left">
                      <ul>
                        <li @click="selectTabArea(0,'moreTitle','saleRenTab')" :class="salePostGetData.moreTitle == 0 ? 'more-active':''">物业类型</li>
                        <!-- 租房没有装修情况 -->
                        <li @click="selectTabArea(1,'moreTitle','saleRenTab')" :class="salePostGetData.moreTitle == 1 ? 'more-active':''" v-show="searchHouseTypeIndex!=1">装修情况</li>
                      </ul>
                    </div>
                    <div class="more-right" v-if="salePostGetData.moreTitle == 0">
                      <div class="more-item" v-for="(item,index) in morePropertyType" :key="index" @click="chooseDistrictAddress(item,'moreTitle',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setMorePropertyType,'id',item.id) != -1?'type-active':''">
                        {{item.name}}
                      </div>
                    </div>
                    <!-- 租房没有装修情况 -->
                    <div class="more-right" v-if="salePostGetData.moreTitle == 1 && searchHouseTypeIndex!=1">
                      <div class="more-item" v-for="(item,index) in moreRenovation" :key="index" @click="chooseDistrictAddress(item,'moreTitle',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setMoreRenovation,'id',item.id) != -1?'type-active':''">
                        {{item.name}}
                      </div>
                    </div>
                  </div>
                  <div class="reset-btn">
                    <div class="selected-more-container" v-show="!$commonUtils.utilCore.empty(salePostGetData.setSelectedMore)">
                      <div class="selected-more-box" :style="salePostGetData.isShowmore?'max-height:100%':''">
                        <div class="selected-title">已选：</div>
                        <div class="selected-content">
                          <div class="selected-box" v-for="(item,index) in salePostGetData.setSelectedMore" :key="index+1">
                            {{item.name}}
                            <div class="selected-close" @click="deleteSelectedMore(item,index,'saleRenTab')">
                              <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="selected-more" v-show="salePostGetData.setSelectedMore.length>3 && !salePostGetData.isShowmore" @click="handleMore('more','saleRenTab')" style="bottom: 0.3rem">
                          更多
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                        </div>
                        <div class="selected-more" v-show="salePostGetData.setSelectedMore.length>3 && salePostGetData.isShowmore" @click="handleMore('more','saleRenTab')" style="bottom: 0.7rem">
                          收起
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('moreTitle','saleRenTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('moreTitle',true,'saleRenTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item title="排序" ref="sortType" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <template #title>
                  <img :src="$appConfig.appWebStaticUrl + sortTypeClass" alt="" class="icon-sort">
                </template>
                <div class="house-sort" v-show="searchHouseTypeIndex==0">
                  <div class="sort-item" v-for="(item,index) in saleSortList" :key="index" @click="changeSort(item,'sortType','saleRenTab')" :class="checkArrayValue(salePostGetData.setSortListVal,'id',item.id) != -1?'sort-active':''">
                    {{item.name}}
                  </div>
                </div>
                <div class="house-sort" v-show="searchHouseTypeIndex==1">
                  <div class="sort-item" v-for="(item,index) in rentSortList" :key="index" @click="changeSort(item,'sortType','saleRenTab')" :class="checkArrayValue(salePostGetData.setSortListVal,'id',item.id) != -1?'sort-active':''">
                    {{item.name}}
                  </div>
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
          <div class="disk-source-type">
            <div class="disk-item" v-for="(item,index) in diskSourceType" :key="index" @click="chooseDistrictAddress(item,'diskSourceType',false,'saleRenTab')" :class="checkArrayValue(salePostGetData.setDiskIndex,'id',item.id) != -1?'active':''">
              {{item.name}}
            </div>
          </div>
          <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(salePostGetData.setSelected)">
            <div class="selected-container" :style="salePostGetData.isShowBoxMore?'max-height:100%':''">
              <div class="selected-top">
                <div class="selected-title">已选：</div>
                <div class="selected-content" :style="salePostGetData.isShowBoxMore?'max-height:100%':''">
                  <div class="selected-box" v-for="(item,index) in salePostGetData.setSelected" :key="index+1">
                    {{item.name}}
                    <div class="selected-close" @click="deleteSelected(item,'saleRenTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="selected-bottom" v-show="salePostGetData.selectedLength>5">
                <div class="selected-bottom-btn" v-show="!salePostGetData.isShowBoxMore" @click="handleMore('select','saleRenTab')" style="margin-right: 0.8rem;">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_arrow_bottom.png'" alt="" class="icon-arrow">
                  更多
                </div>
                <div class="selected-bottom-btn" v-show="salePostGetData.isShowBoxMore" @click="handleMore('select','saleRenTab')" style="margin-right: 0.8rem;">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_arrow_top.png'" alt="" class="icon-arrow">
                  收起
                </div>
                <div class="selected-bottom-btn" @click="resetFunciton('allConditions','saleRenTab')">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_empty01.png'" alt="" class="icon-empty">
                  清空
                </div>
              </div>
            </div>
            <div class="fixed-line"></div>
          </div>
        </div>
      </van-sticky>

      <div class="content-header" v-show="searchHouseTypeIndex==0 && saleList.length>0">
        <houselistItem :list="saleList" @goDetail="goDetail"></houselistItem>
        <div class="more-house" @click="goToolPageView('sale')">更多二手房</div>
      </div>
      <div class="content-header" v-show="searchHouseTypeIndex==1 && rentList.length>0">
        <houselistItem :list="rentList" @goDetail="goDetail"></houselistItem>
        <div class="more-house" @click="goToolPageView('rent')">更多租房</div>
      </div>
      <div class="nothing-house" v-show="saleList.length==0 && rentList.length==0 && !salePostGetData.loading">
        <div class="nothing-text">暂无相关房源</div>
        <div class="empty-btn" @click="resetFunciton('allConditions','saleRenTab')">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_merge_empty.png'" alt="">
          清空筛选条件
        </div>
      </div>
    </div>

    <!-- 成交列表的容器 -->
    <div class="deal-list-box" ref="dealContainer" v-show="saleDealIndex==2 && dealPostGetData.isShowBox">
      <van-sticky :container="dealContainer" :offset-top="navheight-10">
        <div class="screen-box">
          <div class="search-condition">
            <van-dropdown-menu active-color="#000000" :close-on-click-outside="false">
              <van-dropdown-item :title="dealPostGetData.titleDistrict" ref="dealDistrict" :title-class="dealDistrictClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-region">
                  <div class="region-content">
                    <div class="region-left">
                      <ul>
                        <li @click="selectTabArea(0,'district','dealTab')" :class="dealPostGetData.tabAreaIndex == 0 ? 'more-active':''">区域</li>
                        <li @click="selectTabArea(1,'district','dealTab')" :class="dealPostGetData.tabAreaIndex == 1 ? 'more-active':''" v-if="districtMetro.length>1">地铁</li>
                      </ul>
                    </div>
                    <template v-if="dealPostGetData.tabAreaIndex == 0">
                      <div class="region-middle">
                        <ul>
                          <li v-for="(item,index) in district" :key="index" :class="dealPostGetData.setDistrict && dealPostGetData.setDistrict.hasOwnProperty('id') && dealPostGetData.setDistrict.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'dealTab')">{{item.name}}</li>
                        </ul>
                      </div>
                      <div class="region-right" ref="scrollRight">
                        <ul>
                          <li v-for="(item,index) in addresslist" :key="index" @click="chooseDistrictAddress(item,'district',false,'dealTab')">
                            <span :class="checkArrayValue(dealPostGetData.setDistrictList,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(dealPostGetData.setDistrictList,'id',item.id)==-1">
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                          </li>
                        </ul>
                      </div>
                    </template>
                    <template v-if="dealPostGetData.tabAreaIndex == 1">
                      <div class="region-middle">
                        <ul>
                          <li v-for="(item,index) in districtMetro" :key="index" :class="dealPostGetData.setDistrictMetro && dealPostGetData.setDistrictMetro.hasOwnProperty('id') && dealPostGetData.setDistrictMetro.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'dealTab')">{{item.name}}</li>
                        </ul>
                      </div>
                      <div class="region-right" ref="scrollRight">
                        <ul>
                          <li v-for="(item,index) in addresslistMetro" :key="index" @click="chooseDistrictAddress(item,'district',false,'dealTab')">
                            <span :class="checkArrayValue(dealPostGetData.setDresslistMetro,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(dealPostGetData.setDresslistMetro,'id',item.id)==-1">
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                          </li>
                        </ul>
                      </div>
                    </template>

                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('district','dealTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('dealDistrict',true,'dealTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="dealPostGetData.titleType" ref="dealLeaseSale" :title-class="dealRentSaleTypeClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()" class="rentSaleClass">
                <div class="house-sort">
                  <div class="sort-item" v-for="(item,index) in rentSaleList" :key="index" @click="changeRentSaleType(item,'dealLeaseSale')" :class="checkArrayValue(dealPostGetData.setLeaseSale,'id',item.id) != -1?'sort-active':''">
                    {{item.name}}
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="dealPostGetData.titleDealYear" ref="dealYear" :title-class="dealYearTypeClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()" class="dealYearClass">
                <div class="house-sort">
                  <div class="sort-item" v-for="(item,index) in dealYearList" :key="index" @click="changeRentSaleType(item,'dealYear')" :class="checkArrayValue(dealPostGetData.setYear,'id',item.id) != -1?'sort-active':''">
                    {{item.name}}
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="dealPostGetData.titleHuxing" ref="dealHuxing" :title-class="dealHuxingClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in huxing" :key="index" @click="chooseDistrictAddress(item,'huxing',false,'dealTab')" :class="checkArrayValue(dealPostGetData.setHuxing,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('huxing','dealTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('dealHuxing',true,'dealTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
          <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(dealPostGetData.setSelected)">
            <div class="selected-container" :style="dealPostGetData.isShowBoxMore?'max-height:100%':''">
              <div class="selected-top">
                <div class="selected-title">已选：</div>
                <div class="selected-content" :style="dealPostGetData.isShowBoxMore?'max-height:100%':''">
                  <div class="selected-box" v-for="(item,index) in dealPostGetData.setSelected" :key="index+1">
                    {{item.name}}
                    <div class="selected-close" @click="deleteSelected(item,'dealTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="selected-bottom" v-show="dealPostGetData.selectedLength>5">
                <div class="selected-bottom-btn" v-show="!dealPostGetData.isShowBoxMore" @click="handleMore('select','dealTab')" style="margin-right: 0.8rem;">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_arrow_bottom.png'" alt="" class="icon-arrow">
                  更多
                </div>
                <div class="selected-bottom-btn" v-show="dealPostGetData.isShowBoxMore" @click="handleMore('select','dealTab')" style="margin-right: 0.8rem;">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_arrow_top.png'" alt="" class="icon-arrow">
                  收起
                </div>
                <div class="selected-bottom-btn" @click="resetFunciton('allConditions','dealTab')">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_empty01.png'" alt="" class="icon-empty">
                  清空
                </div>
              </div>
            </div>
            <div class="fixed-line"></div>
          </div>
        </div>
      </van-sticky>
      <div class="deal-container" v-show="dealHouseList.length>0">
        <div class="deal-box" @click="goDealDetail(item)" v-for="(item,index) in dealHouseList" :key="index+1">
          <div class="deal-left-box">
            <div class="deal-left" :class="{'deal-active':dealPostGetData.leaseSaleIndex==2}">{{dealPostGetData.leaseSaleIndex==1?'售':'租'}}</div>
          </div>
          <div class="deal-right">
            <div class="deal-address deal-padbottom">{{dealPostGetData.leaseSaleIndex==1?item.shouse_title:item.rent_title}}</div>
            <div class="deal-label deal-padbottom">{{item.house_orientation_name}}/{{item.floor_name}}/{{item.acreage_cover}}㎡</div>
            <div class="deal-time deal-padbottom">签约日期：{{$commonUtils.utilDate.date("Y.m",item.sign_time)}}</div>
            <div class="deal-price" v-if="dealPostGetData.leaseSaleIndex==1">
              <div class="price-left">
                <span>{{item.trade_amount_w}}</span>
                <span class="price-unit">万</span>
              </div>
              <div class="price-right">{{item.average_price}}元/㎡</div>
            </div>
            <div class="rent-price" v-else>
              <span>{{item.trade_amount}}</span>元/月
            </div>
          </div>
        </div>
        <div class="more-deal" v-show="dealHouseList.length>0" @click="goDealist()">更多历史成交房源</div>
      </div>
      <div class="nothing-house" v-show="dealHouseList.length==0 && !dealPostGetData.loading">
        <div class="nothing-text">暂无相关房源</div>
        <div class="empty-btn" @click="resetFunciton('allConditions','dealTab')">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_merge_empty.png'" alt="">
          清空筛选条件
        </div>
      </div>
    </div>
    <!-- 新房的列表容器 -->
    <div class="newhouse-box" v-show="newhousePostGetData.isShowBox">
      <div class="hidden-box" ref="newHouseRef"></div>
      <div class="split-line"></div>
      <div class="newhouse-title">新房楼盘：</div>
      <van-sticky :offset-top="navheight-10" @change="changeFixed">
        <div class="screen-box">
          <div class="search-condition">
            <van-dropdown-menu active-color="#000000" :close-on-click-outside="false">
              <van-dropdown-item :title="newhousePostGetData.titleDistrict" ref="newDistrict" :title-class="newDistrictClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-region">
                  <div class="region-content">
                    <div class="region-left">
                      <ul>
                        <li @click="selectTabArea(0,'district','newTab')" :class="newhousePostGetData.tabAreaIndex == 0 ? 'more-active':''">区域</li>
                        <li @click="selectTabArea(1,'district','newTab')" :class="newhousePostGetData.tabAreaIndex == 1 ? 'more-active':''" v-if="districtMetro.length>1">地铁</li>
                      </ul>
                    </div>
                    <template v-if="newhousePostGetData.tabAreaIndex == 0">
                      <div class="region-middle">
                        <ul>
                          <li v-for="(item,index) in district" :key="index" :class="newhousePostGetData.setDistrict && newhousePostGetData.setDistrict.hasOwnProperty('id') && newhousePostGetData.setDistrict.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'newTab')">{{item.name}}</li>
                        </ul>
                      </div>
                      <div class="region-right" ref="scrollRight">
                        <ul>
                          <li v-for="(item,index) in addresslist" :key="index" @click="chooseDistrictAddress(item,'district',false,'newTab')">
                            <span :class="checkArrayValue(newhousePostGetData.setDistrictList,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(newhousePostGetData.setDistrictList,'id',item.id)==-1">
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                          </li>
                        </ul>
                      </div>
                    </template>
                    <!-- 地铁 -->
                    <template v-if="newhousePostGetData.tabAreaIndex == 1">
                      <div class="region-middle">
                        <ul>
                          <li v-for="(item,index) in districtMetro" :key="index" :class="newhousePostGetData.setDistrictMetro && newhousePostGetData.setDistrictMetro.hasOwnProperty('id') && newhousePostGetData.setDistrictMetro.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'newTab')">{{item.name}}</li>
                        </ul>
                      </div>
                      <div class="region-right" ref="scrollRight">
                        <ul>
                          <li v-for="(item,index) in addresslistMetro" :key="index" @click="chooseDistrictAddress(item,'district',false,'newTab')">
                            <span :class="checkArrayValue(newhousePostGetData.setDresslistMetro,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(newhousePostGetData.setDresslistMetro,'id',item.id)==-1">
                            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                          </li>
                        </ul>
                      </div>
                    </template>

                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('district','newTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('newDistrict',true,'newTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="newhousePostGetData.titlePrice" ref="newPriceTab" :title-class="newPriceTabClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-price house-type">
                  <div class="price-tab">
                    <div class="tab-first" @click="selectTabArea(0,'priceTab','newTab')" :class="newhousePostGetData.tabPriceIndex == 0?'price-tab-active':''">总价 (万/套)</div>
                    <div class="tab-second" @click="selectTabArea(1,'priceTab','newTab')" :class="newhousePostGetData.tabPriceIndex == 1?'price-tab-active':''">单价 (万/㎡)</div>
                  </div>
                  <template v-if="newhousePostGetData.tabPriceIndex == 0">
                    <div class="type-content price-content">
                      <div class="type-item" v-for="(item,index) in priceTabFirst" :key="index" @click="chooseDistrictAddress(item,'priceTab',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setPriceTabFirst,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                    </div>
                    <div class="price-ipt">
                      <input type="number" class="_iosKeyboardInput" v-model="newhousePostGetData.setPriceFirstVal[0]" placeholder="最低总价(万)" @keyup="checkPriceInput(0,'newTab')">
                      <span>至</span>
                      <input type="number" class="_iosKeyboardInput" v-model="newhousePostGetData.setPriceFirstVal[1]" placeholder="最高总价(万)" @keyup="checkPriceInput(1,'newTab')">
                    </div>
                  </template>
                  <template v-if="newhousePostGetData.tabPriceIndex == 1">
                    <div class="type-content price-content">
                      <div class="type-item" v-for="(item,index) in priceTabSecond" :key="index" @click="chooseDistrictAddress(item,'priceTab',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setPriceTabSecond,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                    </div>
                    <div class="price-ipt">
                      <input type="number" class="_iosKeyboardInput" v-model="newhousePostGetData.setPriceSecondVal[0]" placeholder="最低单价(万)" @keyup="checkPriceInput(0,'newTab')">
                      <span>至</span>
                      <input type="number" class="_iosKeyboardInput" v-model="newhousePostGetData.setPriceSecondVal[1]" placeholder="最高单价(万)" @keyup="checkPriceInput(1,'newTab')">
                    </div>
                  </template>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div @click="resetFunciton('priceTab','newTab')" class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('newPriceTab',true,'newTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="newhousePostGetData.titleArea" ref="newArea" :title-class="newAreaClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in moreArea" :key="index" @click="chooseDistrictAddress(item,'area',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setMoreArea,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('area','newTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('newArea',true,'newTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item :title="newhousePostGetData.titleHuxing" ref="newHuxing" :title-class="newHuxingClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in huxing" :key="index" @click="chooseDistrictAddress(item,'huxing',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setHuxing,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="reset-btn">
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('huxing','newTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('newHuxing',true,'newTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item title="更多" ref="newMoreTitle" :title-class="newMoreTitleClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <div class="house-more">
                  <div class="more-content">
                    <div class="more-left">
                      <ul>
                        <li @click="selectTabArea(0,'moreTitle','newTab')" :class="newhousePostGetData.moreTitle == 0 ? 'more-active':''">物业类型</li>
                        <!-- <li @click="selectTabArea(1,'moreTitle','newTab')" :class="newhousePostGetData.moreTitle == 1 ? 'more-active':''">装修情况</li> -->
                      </ul>
                    </div>
                    <div class="more-right" v-if="newhousePostGetData.moreTitle == 0">
                      <div class="more-item" v-for="(item,index) in morePropertyType" :key="index" @click="chooseDistrictAddress(item,'moreTitle',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setMorePropertyType,'id',item.id) != -1?'type-active':''">
                        {{item.name}}
                      </div>
                    </div>
                    <!-- <div class="more-right" v-if="newhousePostGetData.moreTitle == 1">
                      <div class="more-item" v-for="(item,index) in moreRenovation" :key="index" @click="chooseDistrictAddress(item,'moreTitle',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setMoreRenovation,'id',item.id) != -1?'type-active':''">
                        {{item.name}}
                      </div>
                    </div> -->
                  </div>
                  <div class="reset-btn">
                    <div class="selected-more-container" v-show="!$commonUtils.utilCore.empty(newhousePostGetData.setSelectedMore)">
                      <div class="selected-more-box" :style="newhousePostGetData.isShowmore?'max-height:100%':''">
                        <div class="selected-title">已选：</div>
                        <div class="selected-content">
                          <div class="selected-box" v-for="(item,index) in newhousePostGetData.setSelectedMore" :key="index+1">
                            {{item.name}}
                            <div class="selected-close" @click="deleteSelectedMore(item,index,'newTab')">
                              <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="selected-more" v-show="newhousePostGetData.setSelectedMore.length>3 && !newhousePostGetData.isShowmore" @click="handleMore('more','newTab')" style="bottom: 0.3rem">
                          更多
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                        </div>
                        <div class="selected-more" v-show="newhousePostGetData.setSelectedMore.length>3 && newhousePostGetData.isShowmore" @click="handleMore('more','newTab')" style="bottom: 0.7rem">
                          收起
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('moreTitle','newTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('newMoreTitle',true,'newTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item title="排序" ref="newSortType" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
                <template #title>
                  <img :src="$appConfig.appWebStaticUrl + newSortTypeClass" alt="" class="icon-sort">
                </template>
                <div class="house-sort">
                  <div class="sort-item" v-for="(item,index) in newSortList" :key="index" @click="changeSort(item,'newSortType','newTab')" :class="checkArrayValue(newhousePostGetData.setSortListVal,'id',item.id) != -1?'sort-active':''">
                    {{item.name}}
                  </div>
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
          <div class="disk-source-type">
            <div class="disk-item" v-for="(item,index) in newDiskSourceType" :key="index" @click="chooseDistrictAddress(item,'diskSourceType',false,'newTab')" :class="checkArrayValue(newhousePostGetData.setDiskIndex,'id',item.id) != -1?'active':''">
              {{item.name}}
            </div>
          </div>
        </div>
      </van-sticky>
      <div class="content-header" v-show="newHouseList.length>0">
        <newhouselistItem :list="newHouseList" @goDetail="goNewDetail" :isNewHouse="true"></newhouselistItem>
      </div>
      <div class="nothing-house" v-show="newHouseList.length==0 && !newhousePostGetData.loading">
        <div class="nothing-text">暂无相关房源</div>
        <div class="empty-btn" @click="resetFunciton('allConditions','newTab')">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_merge_empty.png'" alt="">
          清空筛选条件
        </div>
      </div>
    </div>

    <div class="every-nothing" v-show="!salePostGetData.isShowBox && !newhousePostGetData.isShowBox && !dealPostGetData.isShowBox && isFinish">暂未搜索到相关房源</div>
    <!-- 回到顶部 -->
    <scrollTop></scrollTop>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
import scrollTop from "@/components/yni/scrolltop.vue"

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    houselistItem,
    newhouselistItem,
    scrollTop,
  },
  data () {
    return {
      navheight: 0, // 导航高度
      diskSourceType: [],//标签列表
      newDiskSourceType: [], //新房标签列表
      saleList: [], // 二手房的数据列表
      rentList: [], // 租房的数据列表
      newHouseList: [], // 新房的数据列表
      dealHouseList: [], // 查成交的列表
      priceTabFirst: [],//价格区间列表（新房二手房）
      priceTabSecond: [],//单价列表(新房)
      huxing: [],//户型

      saleSortList: [
        //排序值
        { id: 0, name: "默认排序", val: "update_time~desc" },
        { id: 1, name: "最新发布", val: "update_time~desc" },
        { id: 2, name: "总价从低到高", val: "price~asc" },
        { id: 3, name: "总价从高到低", val: "price~desc" },
        { id: 4, name: "单价从低到高", val: "average_price~asc" },
        { id: 5, name: "单价从高到低", val: "average_price~desc" },
        { id: 6, name: "面积从小到大", val: "acreage_cover~asc" },
        { id: 7, name: "面积从大到小", val: "acreage_cover~desc" },
      ], // 二手房的排序
      rentSortList: [
        //排序值
        { id: 0, name: "默认排序", val: "update_time~desc" },
        { id: 1, name: "最新发布", val: "update_time~desc" },
        { id: 2, name: "租金从低到高", val: "rent_price~asc" },
        { id: 3, name: "租金从高到低", val: "rent_price~desc" },
        { id: 4, name: "面积从大到小", val: "acreage~desc" },
        { id: 5, name: "面积从小到大", val: "acreage~asc" },
      ],// 租房的排序
      newSortList: [
        //排序值
        { id: 0, name: "默认排序", val: "update_time~desc" },
        { id: 1, name: "最新发布", val: "update_time~desc" },
        { id: 2, name: "开盘时间", val: "open_time~desc" },
        { id: 3, name: "均价从低到高", val: "average_price~asc" },
        { id: 4, name: "均价从高到低", val: "average_price~desc" },
      ],// 新房的排序
      moreArea: [],//建筑面积列表
      morePropertyType: [],//物业类型
      moreRenovation: [],//装修情况
      // 区域
      district: [],
      //区域地址
      addresslist: [],
      // 地铁区域(线路)
      districtMetro: [],
      //地铁区域地址(站点)
      addresslistMetro: [],
      salePostGetData: { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换
        tabPriceIndex: 0, // 价格tab切换
        moreTitle: 0, // “更多”导航的标题选项
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        setSortListVal: [],//选择的排序信息
        setSelected: [],// 已选中的
        setSelectedMore: [], // “更多”已选中的数据
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        city_id: 8,//	否	string	城市id 默认8
        page: 1,
        page_size: 10,
        total: 0, // 房源总数
        searchUptownId: '', // 小区id
        isShowBox: false,
        titleDistrict: '区域', //筛选区域标题
        titlePrice: '价格', //筛选价格标题
        titleArea: '面积', //筛选面积标题
        titleHuxing: '户型', //筛选户型标题
        titleMore: '更多',//筛选更多标题
        isShowmore: false,
        selectedLength: '', // 已选中的长度，避免报错
        isShowBoxMore: false,
        loading: true,//列表数据加载中
        setAreaFirstVal: '',
        setAreaLastVal: ''
      },
      newhousePostGetData: {
        tabAreaIndex: 0,//区域tab切换 
        tabPriceIndex: 0, // 价格tab切换
        moreTitle: 0, // “更多”导航的标题选项
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        setSortListVal: [],//选择的排序信息
        setSelected: [],// 已选中的
        setSelectedMore: [], // “更多”已选中的数据
        houseType: "house",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        city_id: 8,//	否	string	城市id 默认8
        page: 1,
        page_size: 10,
        total: 0, // 房源总数
        isShowBox: false,
        isShowmore: false,
        titleDistrict: '区域', //筛选区域标题
        titlePrice: '价格', //筛选价格标题
        titleArea: '面积', //筛选面积标题
        titleHuxing: '户型', //筛选户型标题
        loading: false,//列表数据加载中
      },
      dealPostGetData: { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setHuxing: [],//户型
        setLayouthall: "", // 厅数
        setLeaseSale: [],//选择的租售类型
        setYear: [],//选择的年份
        setSelected: [],// 已选中的
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        leaseSaleIndex: 1, // 租售类型 1售 2租
        searchKeyWord: "",//搜索关键字
        searchUptownId: "",//
        inputKeyWord: "",//
        total: 0, // 房源总数
        page: 1,
        page_size: 10,
        isShowBox: false,
        selectedLength: '', // 已选中的长度，避免报错
        isShowBoxMore: false,
        titleDistrict: '区域', //筛选区域标题
        titleType: '租/售类别',  //筛选租/售类别标题
        titleDealYear: '成交年份', //筛选成交年份标题
        titleHuxing: '户型', //筛选户型标题
        loading: false,//列表数据加载中
      },
      cloneObject: {}, //深拷贝筛选点击确定后的数据
      isClosed: false,
      houseType: [
        {
          id: 1,
          name: '二手房',
          icon: 'icon_black_sale',
          selecticon: 'icon_white_sale',
        },
        {
          id: 2,
          name: '新房楼盘',
          icon: 'icon_black_newhouse',
          selecticon: 'icon_white_newhouse02',
        },
      ],
      rentSaleList: [
        //排序值
        // { id: 0, name: "全部", val: "update_time~desc" },
        { id: 1, name: "售" },
        { id: 2, name: "租" },
      ],
      dealYearList: [
        //排序值
        { id: 0, name: "全部", val: "" },
        { id: 1, name: "2023年", val: "2023" },
        { id: 2, name: "2022年", val: "2022" },
        { id: 3, name: "2021年", val: "2021" },
        { id: 4, name: "2020年", val: "2020" },
        { id: 5, name: "2019年", val: "2019" },
        { id: 6, name: "2018年", val: "2018" },
      ],
      houseTypeIndex: 1, // 切换房源索引
      saleDealIndex: 1, // 在售 历史成交切换
      saleContainer: null,
      dealContainer: null,
      searchHouseTypeIndex: 0, // 0是买房/新房，1是租房
      searchInputkeyword: '',
      isFinish: false,
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
    ...mapState("home", ["searchPostGetData"]), //房源的信息
    // 二手房/租房的筛选样式
    districtClass () {//是否有选择区域里的条件
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setDistrict.id) || !this.$commonUtils.utilCore.empty(this.salePostGetData.setDistrictMetro.id)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setDistrictList) || !this.$commonUtils.utilCore.empty(this.salePostGetData.setDresslistMetro)) {
        return "choose-active"
      }
      return ""
    },
    priceTabClass () {//是否有选择价格里的条件
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setPriceTabFirst) || !this.$commonUtils.utilCore.empty(this.salePostGetData.setPriceTabSecond)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(this.salePostGetData.setPriceFirstVal[1])) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(this.salePostGetData.setPriceSecondVal[1])) {
        return "choose-active"
      }
      return ""
    },
    areaClass () {//是否有选择面积里的条件
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setMoreArea)) {
        return "choose-active"
      }
      //输入面积时
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setAreaFirstVal) && !this.$commonUtils.utilCore.empty(this.salePostGetData.setAreaLastVal)) {
        return "choose-active"
      }
      return ""
    },
    huxingClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setHuxing) && !this.$commonUtils.utilCore.empty(this.salePostGetData.setHuxing[0].id)) {
        return "choose-active"
      }
      return ""
    },
    moreTitleClass () {//是否有选择更多里的条件
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setMorePropertyType)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setMoreRenovation)) {
        return "choose-active"
      }
      return ""
    },
    sortTypeClass () {//是否有选择排序
      // if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setSortListVal)) {
      //   return "choose-active"
      // }
      // return ""
      if (!this.$commonUtils.utilCore.empty(this.salePostGetData.setSortListVal) && !this.$commonUtils.utilCore.empty(this.salePostGetData.setSortListVal[0].id)) {
        return "/home/icon_sort01.png"
      }
      return "/home/icon_sort.png"
    },
    // 新房的筛选样式
    newDistrictClass () {//是否有选择区域里的条件
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setDistrict.id) || !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setDistrictMetro.id)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setDistrictList) || !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setDresslistMetro)) {
        return "choose-active"
      }
      return ""
    },
    newPriceTabClass () {//是否有选择价格里的条件
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setPriceTabFirst) || !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setPriceTabSecond)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setPriceFirstVal[1])) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setPriceSecondVal[1])) {
        return "choose-active"
      }
      return ""
    },
    newAreaClass () {//是否有选择面积里的条件
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setMoreArea)) {
        return "choose-active"
      }
      return ""
    },
    newHuxingClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setHuxing) && !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setHuxing[0].id)) {
        return "choose-active"
      }
      return ""
    },
    newMoreTitleClass () {//是否有选择更多里的条件
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setMorePropertyType)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setMoreRenovation)) {
        return "choose-active"
      }
      return ""
    },
    newSortTypeClass () {//是否有选择排序
      // if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setSortListVal)) {
      //   return "choose-active"
      // }
      // return ""
      if (!this.$commonUtils.utilCore.empty(this.newhousePostGetData.setSortListVal) && !this.$commonUtils.utilCore.empty(this.newhousePostGetData.setSortListVal[0].id)) {
        return "/home/icon_sort01.png"
      }
      return "/home/icon_sort.png"
    },
    // 成交列表的筛选样式
    dealDistrictClass () {//是否有选择区域里的条件
      if (!this.$commonUtils.utilCore.empty(this.dealPostGetData.setDistrict.id) || !this.$commonUtils.utilCore.empty(this.dealPostGetData.setDistrictMetro.id)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.dealPostGetData.setDistrictList) || !this.$commonUtils.utilCore.empty(this.dealPostGetData.setDresslistMetro)) {
        return "choose-active"
      }
      return ""
    },
    dealRentSaleTypeClass () {//是否有选择租售类型
      if (!this.$commonUtils.utilCore.empty(this.dealPostGetData.setLeaseSale)) {
        return "choose-active"
      }
      return ""
    },
    dealYearTypeClass () {//是否有选择年份
      if (!this.$commonUtils.utilCore.empty(this.dealPostGetData.setYear) && this.dealPostGetData.setYear[0].id != 0) {
        return "choose-active"
      }
      return ""
    },
    dealHuxingClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.dealPostGetData.setHuxing) && !this.$commonUtils.utilCore.empty(this.dealPostGetData.setHuxing[0].id)) {
        return "choose-active"
      }
      return ""
    },
  },
  watch: {
    "salePostGetData.setAreaFirstVal": {
      handler () {
        if (this.salePostGetData.setMoreArea.length > 0 && this.salePostGetData.setAreaFirstVal) {
          this.salePostGetData.setMoreArea = []
        }
      }
    },
    "salePostGetData.setAreaLastVal": {
      handler () {
        if (this.salePostGetData.setMoreArea.length > 0 && this.salePostGetData.setAreaLastVal) {
          this.salePostGetData.setMoreArea = []
        }
      }
    },
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === "home-detail-secondhouseDetail" || from.name === "/home/detail/newhouseDetail" || from.name === "/home/detail/renthouseDetail" || from.name === "/home/list/secondhouseList" || from.name === "/home/list/renthouseList" || from.name === "home-detail-dealSaleDetail" || from.name === "home-detail-dealRentDetail" || from.name === "/home/list/dealist") {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next(vm => {
      // vm.pageFrom = from.name;
    });
  },
  async activated () {
    this.saleContainer = this.$refs.saleContainer
    this.dealContainer = this.$refs.dealContainer
    if (!this.$route.meta.canKeep) {
      const toggleArray = ["district", "priceTab", "area", "huxing", "moreTitle", "sortType", "dealDistrict", "dealLeaseSale", "dealYear", "dealHuxing", "newDistrict", "newPriceTab", "newArea", "newHuxing", "newMoreTitle", "newSortType"];
      // 避免获取不到dom
      this.isClosed = true;
      setTimeout(() => {
        for (let i = 0; i < toggleArray.length; i++) {
          const itemCol = toggleArray[i];
          if (this.$refs[itemCol]) {
            this.$refs[itemCol].toggle(false);
          }
        }
      }, 100);
      await this.getListConfigInit();
    }
  },
  methods: {
    ...mapMutations('city', ['setRecentCity', 'setSwitchCityInfo']),
    //初始化搜索选项
    async getListConfigInit () {
      this.isFinish = false
      this.saleList = []
      this.rentList = []
      this.newHouseList = []
      this.dealHouseList = []
      this.houseTypeIndex = 1 // 切换房源索引
      this.saleDealIndex = 1 // 在售 历史成交切换
      this.salePostGetData = { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        tabPriceIndex: 0, // 价格tab切换
        moreTitle: 0, // “更多”导航的标题选项
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        setSortListVal: [],//选择的排序信息
        setSelected: [],// 已选中的
        setSelectedMore: [], // “更多”已选中的数据
        searchUptownId: '', // 小区id
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        titleDistrict: '区域', //筛选区域标题
        titlePrice: '价格', //筛选价格标题
        titleArea: '面积', //筛选面积标题
        titleHuxing: '户型', //筛选户型标题
        titleMore: '更多',//筛选更多标题
        total: 0, // 房源总数
        page: 1,
        page_size: 10,
        isShowBox: false,
        isShowmore: false,
        selectedLength: '', // 已选中的长度，避免报错
        isShowBoxMore: false,
        loading: false,//列表数据加载中
        setAreaFirstVal: '',
        setAreaLastVal: '',
      }
      this.newhousePostGetData = { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 
        tabPriceIndex: 0, // 价格tab切换
        moreTitle: 0, // “更多”导航的标题选项
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        setSortListVal: [],//选择的排序信息
        setSelected: [],// 已选中的
        setSelectedMore: [], // “更多”已选中的数据
        searchUptownId: '', // 小区id
        houseType: "house",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        titleDistrict: '区域', //筛选区域标题
        titlePrice: '价格', //筛选价格标题
        titleArea: '面积', //筛选面积标题
        titleHuxing: '户型', //筛选户型标题
        total: 0, // 房源总数
        page: 1,
        page_size: 10,
        isShowBox: false,
        isShowmore: false,
        loading: false,//列表数据加载中
      }
      this.dealPostGetData = { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setHuxing: [],//户型
        setLayouthall: "", // 厅数
        setLeaseSale: [],//选择的租售类型
        setYear: [],//选择的年份
        setSelected: [],// 已选中的
        leaseSaleIndex: 1, // 租售类型 1售 2租
        searchUptownId: '', // 小区id
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        inputKeyWord: "",//
        total: 0, // 房源总数
        isShowBox: false,
        selectedLength: '', // 已选中的长度，避免报错
        titleDistrict: '区域', //筛选区域标题
        titleType: '租/售类别',  //筛选租/售类别标题
        titleDealYear: '成交年份', //筛选成交年份标题
        titleHuxing: '户型', //筛选户型标题
        page: 1,
        page_size: 10,
        loading: false,//列表数据加载中
      }

      if (!this.$commonUtils.utilCore.empty(this.searchPostGetData)) {
        this.searchInputkeyword = this.searchPostGetData.inputKeyWord
        // this.salePostGetData.inputKeyWord = this.searchPostGetData.inputKeyWord;
        this.searchHouseTypeIndex = this.searchPostGetData.typeIndex;
        // 二手房跟租房是同个对象
        this.salePostGetData.searchKeyWord = this.searchPostGetData.searchKeyWord;
        this.salePostGetData.searchUptownId = this.searchPostGetData.searchUptownId;
        // 新房
        this.newhousePostGetData.searchKeyWord = this.searchPostGetData.searchKeyWord;
        // 成交
        this.dealPostGetData.searchKeyWord = this.searchPostGetData.searchKeyWord || "";
        this.dealPostGetData.searchUptownId = this.searchPostGetData.searchUptownId || "";
        this.dealPostGetData.inputKeyWord = this.searchPostGetData.inputKeyWord || "";
        this.cloneObject = {};
      }
      if (this.searchHouseTypeIndex == 0) {
        this.getSaleList(this.getNewList)
        this.changeRentSaleType({ id: 1, name: "售" }, 'dealLeaseSale', false)
        this.dealPostGetData.leaseSaleIndex = 1
      } else {
        this.salePostGetData.titlePrice = '租金'
        this.getRentList(this.getNewList)
        this.changeRentSaleType({ id: 2, name: "租" }, 'dealLeaseSale', false)
        this.dealPostGetData.leaseSaleIndex = 2
      }
      this.getFilterCriteria()
      this.isClosed = false;
      this.handleDropdownClone(1);//初始化深拷贝
      setTimeout(() => {
        this.computedHeight()
      }, 1);
    },
    // 动态初始化筛选条件
    async getFilterCriteria () {
      let res = "";
      //区域列表
      let postData = {
        city_id: this.switchCityInfo.city_id || 8
      }
      res = await this.$store.dispatch('home/getAppGetAreaTree', postData);
      if (res && res[postData.city_id]) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.district = []
        //增加 不限 的选项 
        this.district.push({
          id: "",
          name: "不限",
          sort: 0,
          children: []
        })
        for (let key in res[postData.city_id]) {
          let tmp_item = res[postData.city_id][key];
          let item = {
            "id": tmp_item.area_id,
            "name": tmp_item.area_name,
            "parent_id": tmp_item.parent_id,
            "first_letter": tmp_item.first_letter,
            "longitude": tmp_item.longitude,
            "latitude": tmp_item.latitude,
            "site_id": tmp_item.site_id,
            "site_id_real": tmp_item.site_id_real,
            "online_status": tmp_item.online_status,
            "online_time": tmp_item.online_time,
            "erp_id": tmp_item.erp_id,
            "sort": tmp_item.sort,
            "children": [],
          }
          item.children.push({
            id: "0",
            name: "不限",
            sort: 0,
          })
          for (let key2 in res[postData.city_id][key].children) {
            tmp_item = res[postData.city_id][key].children[key2];
            let item2 = {
              "id": tmp_item.area_id,
              "name": tmp_item.area_name,
              "parent_id": tmp_item.parent_id,
              "first_letter": tmp_item.first_letter,
              "longitude": tmp_item.longitude,
              "latitude": tmp_item.latitude,
              "site_id": tmp_item.site_id,
              "site_id_real": tmp_item.site_id_real,
              "online_status": tmp_item.online_status,
              "online_time": tmp_item.online_time,
              "erp_id": tmp_item.erp_id,
              "sort": tmp_item.sort
            }
            item.children.push(item2)
          }
          this.district.push(item)
          delete res[postData.city_id][key];

          //记录默认选择的地址
          if (this.salePostGetData.setDistrict && this.salePostGetData.setDistrict.hasOwnProperty('id') && this.salePostGetData.setDistrict.id == item.id) {
            this.addresslist = item.children;
          }
        }
        res = ""
      } else {
        this.$commonUtils.utilCore.showToast("初始化区域列表出错")
      }

      //地铁列表
      postData = {
        city_id: this.switchCityInfo.city_id || 8
      }
      res = await this.$store.dispatch('home/getAppGetMetroTree', postData);
      if (res) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.districtMetro = []
        this.districtMetro.push({
          id: "",
          name: "不限",
          sort: 0,
          children: []
        })
        for (let key in res[postData.city_id]) {
          let tmp_item = res[postData.city_id][key];
          let item = {
            "id": tmp_item.metro_line_id,
            "name": tmp_item.metro_line_name,
            "metro_line_search_name": tmp_item.metro_line_search_name,
            "line_uid": tmp_item.line_uid,
            "metro_station_ids": tmp_item.metro_station_ids,
            "site_id": tmp_item.site_id,
            "sort": tmp_item.sort,
            "children": []
          }
          item.children.push({
            id: "0",
            name: "不限",
            sort: 0,
          })
          // 地铁
          // for (let key2 in res[postData.city_id][key].children) {
          //   tmp_item = res[postData.city_id][key].children[key2];

          let metro_station_ids = res[postData.city_id][key].metro_station_ids && res[postData.city_id][key].metro_station_ids.split(',') || []
          let children = res[postData.city_id][key].children
          for (let key2 in metro_station_ids) {
            for (let key3 in children) {
              if (children[key3].metro_station_id == metro_station_ids[key2]) {
                tmp_item = children[key3];
                let item2 = {
                  "id": tmp_item.metro_station_id,
                  "name": tmp_item.metro_station_name,
                  "metro_line_ids": tmp_item.metro_line_ids,
                  "longitude": tmp_item.longitude,
                  "latitude": tmp_item.latitude,
                  "site_id": tmp_item.site_id,
                  "sort": tmp_item.sort,
                  "back_city_id": tmp_item.back_city_id
                }
                item.children.push(item2)
                break;
              }
            }
          }
          this.districtMetro.push(item)
          delete res[postData.city_id][key];
          //记录默认的选择线路站点
          if (this.salePostGetData.setDistrictMetro && this.salePostGetData.setDistrictMetro.hasOwnProperty('id') && this.salePostGetData.setDistrictMetro.id == item.id) {
            this.addresslistMetro = item.children;
          }
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化地铁列表出错")
      }
      //价格区间列表（新房二手房）
      res = await this.$store.dispatch(`home/${this.searchHouseTypeIndex == 0 ? 'getAppBase_shouse_total_price' : 'getAppBase_rent_price'}`);
      if (res) {
        this.priceTabFirst = []
        if (this.searchHouseTypeIndex == 1) {
          for (let key in res) {
            let item = res[key];
            let tmp_item = {
              id: item.rent_price_id,
              name: item.rent_price_name,
              min: item.rent_price_min,
              max: item.rent_price_max,
              site_id: item.site_id,
              sort: item.sort,
            }
            //转换一下数据的key,方便要求多选
            this.priceTabFirst.push(tmp_item);
          }
        } else {
          for (let key in res) {
            let item = res[key];
            let tmp_item = {
              id: item.shouse_total_price_id,
              name: item.shouse_total_price_name,
              min: item.shouse_total_price_min,
              max: item.shouse_total_price_max,
              site_id: item.site_id,
              sort: item.sort,
            }
            //转换一下数据的key,方便要求多选
            this.priceTabFirst.push(tmp_item);
          }
        }

      } else {
        this.$commonUtils.utilCore.showToast("初始化价格区间列表出错")
      }


      //户型列表
      res = await this.$store.dispatch('home/getAppBase_layout_room');
      if (res) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.huxing = []
        //增加 不限 的选项 
        this.huxing.push({
          id: "",
          name: "不限",
          dname: "不限",
          bname: "不限",
          fname: "不限",
          sort: 0,
        })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.layout_room_id,
            name: item.layout_room_cname,
            dname: item.layout_room_dname,
            bname: item.layout_room_bname,
            fname: item.layout_room_fname,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.huxing.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化户型列表出错")
      }
      //建筑面积列表
      res = await this.$store.dispatch('home/getAppBase_acreage');
      if (res) {
        //this.$commonUtils.appLog.log("返回结果", res)
        this.moreArea = []
        // this.moreArea.push({
        //   id: "",
        //   name: "不限",
        //   sort: 0,
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.acreage_id,
            name: item.acreage_name,
            min: item.acreage_min,
            max: item.acreage_max,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.moreArea.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化建筑面积列表出错")
      }
      //单价列表(新房)
      res = await this.$store.dispatch('home/getAppBase_loupan_unit_price');
      if (res) {
        //this.$commonUtils.appLog.log("返回结果", res)
        this.priceTabSecond = []
        // this.priceTabSecond.push({
        //   id: "",
        //   name: "不限",
        //   sort: 0,
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.loupan_unit_price_id,
            name: item.loupan_unit_price_name,
            min: item.loupan_unit_price_min,
            max: item.loupan_unit_price_max,
            site_id: item.site_id,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.priceTabSecond.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
      //二级标签-二手房
      res = await this.$store.dispatch(`home/${this.searchHouseTypeIndex == 0 ? 'getAppFangSaleGetSecondTag' : 'getAppFangRentGetSecondTag'}`);
      if (res) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.diskSourceType = []
        // this.diskSourceType.push({
        //   id: "",
        //   name: "不限",
        //   val: "",
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.second_tag_id,
            name: item.name,
            val: item.second_tag_id
          }
          //转换一下数据的key,方便要求多选
          this.diskSourceType.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
      //二级标签-二手房
      res = await this.$store.dispatch('home/getAppFangHouseGetSecondTag');
      if (res) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.newDiskSourceType = []
        // this.diskSourceType.push({
        //   id: "",
        //   name: "不限",
        //   val: "",
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.id,
            name: item.name,
            val: item.id
          }
          //转换一下数据的key,方便要求多选
          this.newDiskSourceType.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化新房二级标签出错")
      }
      //物业类型-二手房/租房
      res = await this.$store.dispatch('home/getAppBase_house_type');
      if (res) {
        // this.$commonUtils.appLog.log("返回结果+++++++++++====================>>>>", res)
        this.morePropertyType = []
        // this.morePropertyType.push({
        //   id: "",
        //   name: "不限",
        //   val: "",
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.house_type_id,
            name: item.house_type_name,
            val: item.house_type_id
          }
          //转换一下数据的key,方便要求多选
          this.morePropertyType.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
      //装修情况列表
      res = await this.$store.dispatch('home/getAppBase_decoration');
      if (res) {
        // this.$commonUtils.appLog.log("返回结果+++++++++++====================>>>>", res)
        this.moreRenovation = []
        // this.moreRenovation.push({
        //   id: "",
        //   name: "不限",
        //   val: "",
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.decoration_id,
            name: item.decoration_name,
            val: item.decoration_id
          }
          //转换一下数据的key,方便要求多选
          this.moreRenovation.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
    },
    // 获取二手房列表
    async getSaleList (fn) {
      this.$commonUtils.utilCore.showLoading();
      this.salePostGetData.loading = true
      this.$commonUtils.appLog.log("=========+++++++++++++==============》》》actOnLoad", this.salePostGetData)
      let res = await this.$store.dispatch("home/actAppFangSaleLists", this.salePostGetData);
      if (res && res.rows) {
        this.salePostGetData.loading = false
        if (fn) {
          await fn()
        }
        if (res.rows.length > 0) {
          res.rows.forEach((item) => {
            let tmp_item = {
              id: item.shouse_id,
              title: item.shouse_title,
              subtitle: this.showTitle(item, 0).toString(),
              left: item.price_name ? item.price_name.replace('万', '') : "",
              right: item.average_price_name,
              ...item
            }
            tmp_item.label = []
            if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
              item.tags.forEach((val) => {
                let tmp_val = {
                  text: val.tag_name,
                  ...val
                }
                tmp_item.label.push(val)
              })
            }
            if (item.price_name.replace('万', '') != 0) {
              this.saleList.push(tmp_item)
            }
          })
          this.salePostGetData.isShowBox = true
        }
        this.salePostGetData.total = res.total
      } else {
        this.$commonUtils.appLog.log("无二手房数据", res)
      }
      setTimeout(() => {
        this.computedHeight()
      }, 1);
    },
    // 获取租房列表
    async getRentList (fn) {
      this.$commonUtils.utilCore.showLoading();
      this.salePostGetData.loading = true
      let res = await this.$store.dispatch("home/actAppFangRentLists", this.salePostGetData);
      if (res && res.rows) {
        this.salePostGetData.loading = false
        if (fn) {
          await fn()
        }
        if (res.rows.length > 0) {
          res.rows.forEach((item) => {
            let tmp_item = {
              id: item.rent_id,
              title: item.rent_title,
              subtitle: this.showTitle(item, 0).toString(),
              left: item.price_name ? item.price_name.replace('万', '') : "",
              right: item.rent_price_name,
              ...item
            }
            tmp_item.label = []
            if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
              item.tags.forEach((val) => {
                let tmp_val = {
                  text: val.tag_name,
                  ...val
                }
                tmp_item.label.push(val)
              })
            }
            if (item.rent_price != 0) {
              this.rentList.push(tmp_item)
            }
          })
          this.salePostGetData.isShowBox = true
        }
        this.salePostGetData.total = res.total
      } else {
        this.$commonUtils.appLog.log("无租房数据", res)
      }
      setTimeout(() => {
        this.computedHeight()
      }, 1);
    },
    // 获取新房列表
    async getNewList () {
      this.newhousePostGetData.loading = true
      this.$commonUtils.appLog.log("=========+++++++++++++==============》》》actOnLoad", this.newhousePostGetData)
      let res = await this.$store.dispatch("home/actAppFangHouseLists", this.newhousePostGetData);
      this.isFinish = true
      if (res && res.rows) {
        this.$commonUtils.utilCore.closeLoading()
        this.newhousePostGetData.loading = false
        if (res.rows.length > 0) {
          res.rows.forEach((item) => {
            let tmp_item = {
              id: item.loupan_id,
              title: item.loupan_name,
              subtitle: this.showTitle(item, 1).toString(),
              right: item.average_price_name,
              ...item
            }
            tmp_item.label = []
            if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
              item.tags.forEach((val) => {
                let tmp_val = {
                  text: val.tag_name,
                  ...val
                }
                tmp_item.label.push(val)
              })
            }
            this.newHouseList.push(tmp_item)
          })
          this.newhousePostGetData.isShowBox = true
        }
        this.newhousePostGetData.total = res.total
      } else {
        this.$commonUtils.appLog.log("无新房数据", res)
      }
    },
    // 获取成交列表
    async getDealList () {
      this.dealPostGetData.loading = true
      this.$commonUtils.appLog.log("=========+++++++++++++==============》》》actOnLoad", this.dealPostGetData)
      let res = await this.$store.dispatch(`home/${this.dealPostGetData.leaseSaleIndex == 1 ? 'actAppFangDealShouseList' : 'actAppFangDealRentList'}`, this.dealPostGetData);
      if (res && res.rows) {
        this.dealPostGetData.loading = false
        if (res.rows.length > 0) {
          this.dealHouseList.push(...res.rows)
          this.dealPostGetData.isShowBox = true
        }
        this.dealPostGetData.total = res.total
      } else {
        this.$commonUtils.appLog.log("无查成交列表数据", res)
      }
    },
    onClickBack () {
      this.$router.go(-1);
    },
    //跳转到详情页
    goDetail (item) {
      if (this.searchHouseTypeIndex == 0) {
        //二手房
        let tmp_query = {
          id: item.shouse_id,//	是	string	二手房id
          broker_id: item.broker_id,//	否	string	经纪人id
          share_broker_id: ""//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/secondhouseDetail',
          query: tmp_query
        })
      } else {
        // 租房
        let tmp_query = {
          id: item.id,//	是	string	租房id
          broker_id: item.broker_id,//	否	string	经纪人id
          share_broker_id: item.share_broker_id || ''//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/renthouseDetail',
          query: tmp_query
        })
      }
    },
    // 跳转新房详情
    goNewDetail (item) {
      let tmp_query = {
        loupan_id: item.loupan_id
      }
      this.toolsGoPageView({
        path: '/home/detail/newhouseDetail',
        query: tmp_query
      })
    },
    // 排序点击事件
    changeSort (item, type, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      tabName.setSortListVal.splice(0, 1);
      tabName.setSortListVal.push(item);
      //不要关那么快
      setTimeout(() => {
        this.closeDropdownMenu(type, true, tabType)
      }, 300)
    },
    //检查是否有输入完两个自定义值(输入完返回true,没有输入完返回false)
    checkInputTwoVal (type, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      }
      //如果是输入了自定义的总价
      if (type == 'priceTab' &&
        (tabName.setPriceFirstVal[1] == '0' || tabName.setPriceFirstVal[0] == '0' || !this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[1]))
      ) {

        if (this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[0]) && tabName.setPriceFirstVal[0] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最低总价！")
          return false;
        }
        if (this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[1]) && tabName.setPriceFirstVal[1] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最高总价!")
          return false;
        }
        if (tabName.setPriceFirstVal[0] > Number(tabName.setPriceFirstVal[1]) || Number(tabName.setPriceFirstVal[1] == '0')) {
          this.$commonUtils.utilCore.showToast("请输入正确的总价区间!")
          return false;
        }
      }
      //如果是输入了自定义的单价
      if (type == 'priceTab' &&
        (tabName.setPriceSecondVal[1] == '0' || tabName.setPriceSecondVal[0] == '0' || !this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[1]))
      ) {

        if (this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[0]) && tabName.setPriceSecondVal[0] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最低单价！")
          return false;
        }
        if (this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[1]) && tabName.setPriceSecondVal[1] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最高单价!")
          return false;
        }
        if (tabName.setPriceSecondVal[0] > Number(tabName.setPriceSecondVal[1]) || Number(tabName.setPriceSecondVal[1] == '0')) {
          this.$commonUtils.utilCore.showToast("请输入正确的单价区间!")
          return false;
        }
      }
      // 如果是租房的才有可输入面积区间
      if (this.searchHouseTypeIndex == 1) {
        //如果输入了自定义的面积
        if (type == 'area' &&
          (this.salePostGetData.setAreaFirstVal == '0' || this.salePostGetData.setAreaLastVal == '0' || !this.$commonUtils.utilCore.empty(this.salePostGetData.setAreaFirstVal) || !this.$commonUtils.utilCore.empty(this.salePostGetData.setAreaLastVal))
        ) {
          if (this.$commonUtils.utilCore.empty(this.salePostGetData.setAreaFirstVal) && this.salePostGetData.setAreaFirstVal != '0') {
            this.$commonUtils.utilCore.showToast("请输入最小面积！")
            return false;
          }
          if (this.$commonUtils.utilCore.empty(this.salePostGetData.setAreaLastVal) && this.salePostGetData.setAreaLastVal != '0') {
            this.$commonUtils.utilCore.showToast("请输入最大面积!")
            return false;
          }
          if (this.salePostGetData.setAreaFirstVal > Number(this.salePostGetData.setAreaLastVal) || Number(this.salePostGetData.setAreaLastVal == '0')) {
            this.$commonUtils.utilCore.showToast("请输入正确的面积区间!")
            return false;
          }
        }
      }

      return true;
    },
    //点击关闭按钮
    async closeDropdownMenu (type, isClose = true, tabType) {
      this.$commonUtils.utilCore.showLoading();
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
        window.scroll(0, 0);
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
        window.scroll(0, 0);
      }
      if (tabType != 'dealTab') {
        //判断两个值的输入是否完成
        if (!this.checkInputTwoVal(type, tabType)) {
          return;
        }
      }
      //进行手动搜索
      tabName.page = 1;
      tabName.page_size = 10
      tabName.city_id = this.switchCityInfo.city_id
      this.handleLoop(tabType)
      if (tabName.setSelected.length > 10) {
        this.$commonUtils.utilCore.showToast("最多只能选择10个选项。")
        return
      }
      // 切换需要重新搜索列表 下拉列表不收回
      if (isClose) {
        this.$refs[type].toggle();
      }
      this.handleDropdownClone(1);//上面改变了postGetData的key值，避免loading不出现, 所以再深拷贝一次
      this.handleDropdownClone(0);
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', tabName);
      // 设置筛选的标题 2023.5.17 取消动态筛选标题
      // this.setDropTitle(tabType)
      if (tabType == 'saleRenTab') {
        if (this.searchHouseTypeIndex == 0) {
          this.saleList = []
          await this.getSaleList()
        } else {
          this.rentList = []
          await this.getRentList()
        }
      } else if (tabType == 'newTab') {
        this.newHouseList = []
        await this.getNewList()
      } else if (tabType == 'dealTab') {
        this.dealHouseList = []
        await this.getDealList()
      }
      this.$commonUtils.utilCore.closeLoading()
      console.log('列表的参数', tabName);
    },
    // 重置函数
    async resetFunciton (type, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      // 清除已选，显示的
      if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
        tabName.setSelected = tabName.setSelected.filter(item => {
          return item.type != type
        })
      }
      if (type == 'district') {//区域
        tabName.setDistrict = ""
        tabName.setDistrictMetro = ""
        tabName.setDistrictList = []
        tabName.setDresslistMetro = []
      } else if (type == "priceTab") {//价格
        tabName.setPriceTabFirst = []
        tabName.setPriceTabSecond = []
        tabName.setPriceFirstVal = ["", ""]
        tabName.setPriceSecondVal = ["", ""]
      } else if (type == "area") { // 面积
        tabName.setMoreArea = []
        this.salePostGetData.setAreaFirstVal = ''
        this.salePostGetData.setAreaLastVal = ''
      } else if (type == "huxing") {//户型
        tabName.setHuxing = []
      } else if (type == "moreTitle") {//更多
        tabName.setMorePropertyType = []
        tabName.setMoreRenovation = []
        tabName.setSelectedMore = []
      } else if (type == 'allConditions') {
        // 清空所有条件
        tabName.setDistrict = ""
        tabName.setDistrictMetro = ""
        tabName.setDistrictList = []
        tabName.setDresslistMetro = []
        tabName.setPriceTabFirst = []
        tabName.setPriceTabSecond = []
        tabName.setPriceFirstVal = ["", ""]
        tabName.setPriceSecondVal = ["", ""]
        tabName.setHuxing = []
        tabName.setMoreArea = []
        tabName.setMorePropertyType = []
        tabName.setMoreRenovation = []
        tabName.setDiskIndex = []
        tabName.setSelected = []
        tabName.setSelectedMore = []
        tabName.titleDistrict = '区域'
        this.salePostGetData.setAreaFirstVal = ''
        this.salePostGetData.setAreaLastVal = ''
        if (tabType == 'dealTab') {
          tabName.leaseSaleIndex = 1 // 重置为售
          tabName.setLeaseSale = []
          tabName.setYear = []
        }
        this.closeDropdownMenu(type, false, tabType)
      }
    },
    // 选择区
    chooseDistrict (itemVal, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      this.resetFunciton('district', tabType)
      this.$refs.scrollRight.scrollTo(0, 0)
      let item = this.$commonUtils.utilCore.deepClone(itemVal);
      if (tabName.tabAreaIndex == 0) {
        this.addresslist = item.children;
        delete item.children
        tabName.setDistrict = item
        //清掉已选的内容
        tabName.setDistrictList = []
        this.cloneObject.addresslist = this.$commonUtils.utilCore.deepClone(this.addresslist);
        if (tabType == 'saleRenTab') {
          this.cloneObject.salePostGetData.setDistrict = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.salePostGetData.setDistrictList = [];
        } else if (tabType == 'newTab') {
          this.cloneObject.newhousePostGetData.setDistrict = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.newhousePostGetData.setDistrictList = [];
        } else {
          this.cloneObject.dealPostGetData.setDistrict = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.dealPostGetData.setDistrictList = [];
        }

      } else if (tabName.tabAreaIndex == 1) {
        this.addresslistMetro = item.children;
        delete item.children
        tabName.setDistrictMetro = item
        //清掉已选的内容
        tabName.setDresslistMetro = []
        this.cloneObject.addresslistMetro = this.$commonUtils.utilCore.deepClone(this.addresslistMetro);
        if (tabType == 'saleRenTab') {
          this.cloneObject.salePostGetData.setDistrictMetro = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.salePostGetData.setDresslistMetro = [];
        } else if (tabType == 'newTab') {
          this.cloneObject.newhousePostGetData.setDistrictMetro = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.newhousePostGetData.setDresslistMetro = [];
        } else {
          this.cloneObject.dealPostGetData.setDistrictMetro = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.dealPostGetData.setDresslistMetro = [];
        }
      }
    },
    // 多选
    chooseDistrictAddress (item, type, isdelete = false, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      if (type == 'district') {//如果选择的是 区域 或 地铁
        item.type = 'district'
        if (isdelete) {
          if (item.tabAreaIndex == 0) {
            tabName.tabAreaIndex = 0
          } else {
            tabName.tabAreaIndex = 1
          }
        }
        // 如果已选要重新取消
        if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
          tabName.setSelected.forEach((itemMore, indexMore) => {
            if (itemMore.type == item.type && itemMore.tabAreaIndex == item.tabAreaIndex && itemMore.id == item.id) {
              tabName.setSelected.splice(indexMore, 1)
            }
          })
        }
        if (tabName.tabAreaIndex == 0) {
          let isAll = this.checkArrayValue(tabName.setDistrictList, 'id', "0");
          //如果选择的是 不限
          if (item.id == "0") {
            if (isAll != -1) {
              tabName.setDistrictList.splice(isAll, 1);
              return
            }
            tabName.setDistrictList = [];
          } else {//如果不是 不限，则需要把 不限去掉了
            if (isAll != -1) {
              tabName.setDistrictList.splice(isAll, 1);
            }
          }

          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(tabName.setDistrictList, 'id', item.id);
          if (isHave != -1) {
            tabName.setDistrictList.splice(isHave, 1);
          } else {
            item.tabAreaIndex = 0
            tabName.setDistrictList.push(item)
          }
        } else if (tabName.tabAreaIndex == 1) {
          let isAll = this.checkArrayValue(tabName.setDresslistMetro, 'id', "0");
          //如果选择的是 不限
          if (item.id == "0") {
            if (isAll != -1) {
              tabName.setDresslistMetro.splice(isAll, 1);
              return
            }
            tabName.setDresslistMetro = [];
          } else {//如果不是 不限，则需要把 不限去掉了
            if (isAll != -1) {
              tabName.setDresslistMetro.splice(isAll, 1);
            }
          }
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(tabName.setDresslistMetro, 'id', item.id);
          if (isHave != -1) {
            tabName.setDresslistMetro.splice(isHave, 1);
          } else {
            item.tabAreaIndex = 1
            tabName.setDresslistMetro.push(item)
          }
        }
      } else if (type == 'priceTab') {//如果选择的是 总价 或 单价
        if (isdelete) {
          if (item.tabPriceIndex == 0) {
            tabName.tabPriceIndex = 0
          } else {
            tabName.tabPriceIndex = 1
          }
        } else {
          item.type = 'priceTab'
        }
        if (tabName.tabPriceIndex == 0) {
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(tabName.setPriceTabFirst, 'id', item.id);
          if (isHave != -1) {
            tabName.setPriceTabFirst.splice(isHave, 1);
          } else {
            item.tabPriceIndex = '0'
            tabName.setPriceTabFirst.push(item)
          }
          tabName.setPriceFirstVal = ["", ""]//输入的总价

        } else {//单价
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(tabName.setPriceTabSecond, 'id', item.id);
          if (isHave != -1) {
            tabName.setPriceTabSecond.splice(isHave, 1);
          } else {
            item.tabPriceIndex = '1'
            tabName.setPriceTabSecond.push(item)
          }
          tabName.setPriceSecondVal = ["", ""]//输入的单价

        }
      } else if (type == 'area') {
        // 如果已选要重新取消
        if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
          tabName.setSelected.forEach((itemMore, indexMore) => {
            if (itemMore.type == item.type && itemMore.id == item.id) {
              tabName.setSelected.splice(indexMore, 1)
            }
          })
        }
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setMoreArea, 'id', item.id);
        if (isHave != -1) {
          tabName.setMoreArea.splice(isHave, 1);
        } else {
          item.type = 'area'
          tabName.setMoreArea.push(item)
        }
        this.salePostGetData.setAreaFirstVal = ''
        this.salePostGetData.setAreaLastVal = ''
      } else if (type == "huxing") {//如果选择的是 户型
        //如果选择的是不限，则需要把所有已经选的户型都去掉
        if (item.id === "") {
          this.resetFunciton('huxing', tabType)
        } else {//如果有选择项的时候要把 不限 去掉
          let isHave = this.checkArrayValue(tabName.setHuxing, 'id', "");
          if (isHave != -1) {
            tabName.setHuxing.splice(isHave, 1);
          }
        }
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setHuxing, 'id', item.id);
        if (isHave != -1) {
          tabName.setHuxing.splice(isHave, 1);
        } else {
          item.type = 'huxing'
          tabName.setHuxing.push(item)
        }
      } else if (type == "moreTitle") {//如果选择的是 更多
        item.type = 'moreTitle'
        if (isdelete) {
          if (item.moreTitle == 0) {
            tabName.moreTitle = 0
          } else if (item.moreTitle == 1) {
            tabName.moreTitle = 1
          } else {
            tabName.moreTitle = 2
          }
        }
        // 已选的情况下点击执行的（更多选项）
        if (!this.$commonUtils.utilCore.empty(tabName.setSelectedMore)) {
          tabName.setSelectedMore.forEach((itemMore, indexMore) => {
            if (itemMore.type == item.type && itemMore.moreTitle == item.moreTitle && itemMore.id == item.id) {
              tabName.setSelectedMore.splice(indexMore, 1)
            }
          })
        }
        if (tabName.moreTitle == 0) {
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(tabName.setMorePropertyType, 'id', item.id);
          if (isHave != -1) {
            tabName.setMorePropertyType.splice(isHave, 1);
          } else {
            item.moreTitle = '0'
            tabName.setMorePropertyType.push(item)
            tabName.setSelectedMore.push(item)
          }
        } else if (tabName.moreTitle == 1) {
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(tabName.setMoreRenovation, 'id', item.id);
          if (isHave != -1) {
            tabName.setMoreRenovation.splice(isHave, 1);
          } else {
            item.moreTitle = '1'
            tabName.setMoreRenovation.push(item)
            tabName.setSelectedMore.push(item)
          }
        }
      } else if (type == 'diskSourceType') {
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setDiskIndex, 'id', item.id);
        if (isHave != -1) {
          tabName.setDiskIndex.splice(isHave, 1);
        } else {
          tabName.setDiskIndex.push(item)
        }
        //进行搜索
        this.handleType(tabType);
      }
    },
    //标签选择 + 搜索
    async handleType (tabType) {
      this.$commonUtils.utilCore.showLoading();
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
        window.scroll(0, 0);
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
        window.scroll(0, 0);
      }
      //进行手动搜索
      tabName.page = 1;
      tabName.page_size = 10
      tabName.city_id = this.switchCityInfo.city_id
      //把数据存在vuex里去
      await this.$store.commit('home/setSearchPostGetData', tabName);
      if (tabType == 'saleRenTab') {
        if (this.searchHouseTypeIndex == 0) {
          this.saleList = []
          await this.getSaleList()
        } else {
          this.rentList = []
          await this.getRentList()
        }
      } else if (tabType == 'newTab') {
        this.newHouseList = []
        await this.getNewList()
      } else if (tabType == 'dealTab') {
        this.dealHouseList = []
        await this.getDealList()
      }
      this.$commonUtils.utilCore.closeLoading()
    },
    //判断数组内的对像的key值是否等于某值(不等于或者不存在则返回 -1,如果等于则返回对应的key)
    checkArrayValue (item, key, val) {
      let str_return = -1;
      if (this.$commonUtils.utilCore.empty(item)) {
        return str_return;
      }
      item.forEach((tmp_item, index) => {
        if (tmp_item && tmp_item.hasOwnProperty(key) && tmp_item[key] == val) {
          str_return = index;
          return
        }
      })
      return str_return;
    },
    //切换 区域 与 地铁 的选择 || 更多
    selectTabArea (index, type, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      if (type == "district") {//区域
        tabName.tabAreaIndex = index
        //切换的时候要求把已选的清掉
        this.resetFunciton(type, tabType)
      } else if (type == "moreTitle") {//更多
        tabName.moreTitle = index
      } else if (type == "priceTab") {//价格
        tabName.tabPriceIndex = index
      } else {
        this.$commonUtils.appLog.log("选择的类型不正确==>", type)
      }
    },
    /**
     * 显示户型等内容
     * item=>数据
     * type=>数据类型
     */
    showTitle (item, type) {
      let strTitle = "";
      if (type == 0) {//二手房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.layout_short_name)) {
          strTitle += item.layout_short_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.acreage_cover_name)) {
          strTitle += item.acreage_cover_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
          if (item.house_orientation_name != '保留') {
            strTitle += item.house_orientation_name + "/"
          }
        }
        if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
          strTitle += item.floor_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle

      } else if (type == 1) {//新房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.property_type_name)) {
          strTitle += item.property_type_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.acreage_name)) {
          strTitle += item.acreage_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.sell_status_name)) {
          strTitle += item.sell_status_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
      } else if (type == 2) {//租房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
          strTitle += item.floor_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
          strTitle += item.house_orientation_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
      } else {
        strTitle = "数据不正确"
      }
      //海珠区/2室1厅/80㎡/朝南北/中楼层
      return strTitle;
    },
    //检查输入的价格
    /**
     * num
     */
    checkPriceInput (num, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      }
      if (tabName.tabPriceIndex == 0) {
        tabName.setPriceFirstVal.length = 2;
        tabName.setPriceFirstVal[num] = tabName.setPriceFirstVal[num].replace(/\D/g, '')
        if (this.salePostGetData.setPriceFirstVal[num] != "") {
          tabName.setPriceTabFirst = []
        }
      }
      if (tabName.tabPriceIndex == 1) {
        tabName.setPriceSecondVal.length = 2;
        tabName.setPriceSecondVal[num] = tabName.setPriceSecondVal[num].replace(/\D/g, '')
        if (this.salePostGetData.setPriceSecondVal[num] != "") {
          tabName.setPriceTabSecond = []
        }
      }
    },
    // 深拷贝筛选数据, type 0：赋值，type 1： 深拷贝
    handleDropdownClone (type = 0) {
      if (this.isClosed) return;
      const cloneArray = ["priceTabFirst", "priceTabSecond", "huxing", "saleSortList", "rentSortList", "newSortList", "moreArea", "morePropertyType", "moreRenovation", "district", "addresslist", "districtMetro", "addresslistMetro", "tabPriceIndex", "tabAreaIndex", "moreTitle", "salePostGetData", "newhousePostGetData", "dealPostGetData"];
      for (let i = 0; i < cloneArray.length; i++) {
        const item = cloneArray[i];
        // 赋值
        if (type === 0) {
          this[item] = this.cloneObject[item];
        } else {
          // 拷贝
          this.cloneObject[item] = this.$commonUtils.utilCore.deepClone(this[item]);
        }
      }
    },
    // 循环查询已选
    handleLoop (tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      tabName.setSelected = []
      let priceRange = [] // 总价价格区间
      let unitPriceRange = [] // 单价价格区间
      // 成交列表没有价格区间
      if (tabType != 'dealTab') {
        if (!this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[0]) && !this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[1])) {
          priceRange = [{
            name: tabName.setPriceFirstVal[0] + "~" + tabName.setPriceFirstVal[1] + '万',
            type: 'priceTab',
            id: '',
            typeIndex: '0'
          }]
        }
        if (!this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[0]) && !this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[1])) {
          unitPriceRange = [{
            name: tabName.setPriceSecondVal[0] + "~" + tabName.setPriceSecondVal[1] + '万',
            type: 'priceTab',
            id: '',
            typeIndex: '1'
          }]
        }
      }
      let arr = [
        tabName.setDistrictList,
        tabName.setDresslistMetro,
        tabName.setPriceTabFirst,
        tabName.setPriceTabSecond,
        tabName.setHuxing,
        tabName.setMoreArea,
        tabName.setMorePropertyType,
        tabName.setMoreRenovation,
        // priceRange,
        // unitPriceRange
      ]
      arr.forEach((item, index) => {
        if (!this.$commonUtils.utilCore.empty(item)) {
          if (item.length > 0) {
            item.forEach((i, idx) => {
              if (i.type == 'huxing' && i.id == '') { } else { tabName.setSelected.push(i) }
            })
          }
        }
      })
      tabName.selectedLength = tabName.setSelected.length
    },
    deleteSelected (item, tabType) {
      // if (item.type == 'priceTab' && item.id == '') {
      //   if (item.typeIndex == '0') {
      //     this.salePostGetData.setPriceFirstVal = ["", ""]//输入的总价
      //   } else {
      //     this.salePostGetData.setPriceSecondVal = ["", ""]//输入的单价
      //   }
      //   this.handleLoop(tabType)
      //   this.closeDropdownMenu(item.type, false, tabType)
      //   return
      // }
      this.chooseDistrictAddress(item, item.type, true, tabType)
      this.closeDropdownMenu(item.type, false, tabType)
    },
    // 删除“更多”的已选中
    deleteSelectedMore (item, index, tabType) {
      this.chooseDistrictAddress(item, item.type, true, tabType)
    },
    handleMore (type, tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      if (type == 'more') {
        tabName.isShowmore = !tabName.isShowmore
      } else {
        tabName.isShowBoxMore = !tabName.isShowBoxMore
        if (!tabName.isShowBoxMore) {
          // 异步获取高度
          setTimeout(() => {
            this.computedHeight()
          }, 10);
        }
      }
    },
    computedHeight () {
      const navheight = document.querySelector(".fixed-container")
      this.navheight = navheight.offsetHeight
    },
    changeHouse (id, isScroll) {
      this.houseTypeIndex = id
      // 是否滚动
      if (isScroll) {
        if (this.houseTypeIndex == 2) {
          this.$refs.newHouseRef.scrollIntoView({
            behavior: "smooth",
            // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
            // block: "start",
            // // // 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"
            // inline: "center"
            // 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"
          })
        } else {
          this.$refs.fixedHeader.scrollIntoView({
            behavior: "smooth",
          })
        }
      }
    },
    // 监听滚动条切换新房
    changeFixed (isFixed) {
      if (isFixed) {
        this.changeHouse(2, false)
      } else {
        this.changeHouse(1, false)
      }
    },
    changeSaleDeal (id) {
      this.saleDealIndex = id
    },
    // 筛选点击事件（租售类型，年份）
    changeRentSaleType (item, type, isShow = true) {
      this.dealHouseList = []
      this.dealPostGetData.loading = true
      if (type == 'dealLeaseSale') {
        this.dealPostGetData.setLeaseSale.splice(0, 1);
        this.dealPostGetData.setLeaseSale.push(item);
        if (this.dealPostGetData.leaseSaleIndex != item.id) {
          this.dealPostGetData.leaseSaleIndex = item.id
        }
      } else {
        this.dealPostGetData.setYear.splice(0, 1);
        this.dealPostGetData.setYear.push(item);
      }
      // this.dealPostGetData.setSelected.push(item)
      //不要关那么快
      setTimeout(() => {
        if (isShow) {
          this.closeDropdownMenu(type, true, 'dealTab')
        } else {
          this.closeDropdownMenu(type, false, 'dealTab')
        }

      }, 300)
    },
    async goDealDetail (i) {
      if (this.dealPostGetData.leaseSaleIndex == 1) {
        this.toolsGoPageView({
          path: '/home/detail/dealSaleDetail',
          query: { shouse_trade_id: i.shouse_trade_id }
        })
      } else {
        this.toolsGoPageView({
          path: '/home/detail/dealRentDetail',
          query: { rent_trade_id: i.rent_trade_id }
        })
      }
    },
    // 跳转同小区同户型
    goDealist () {
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', this.dealPostGetData);
      this.toolsGoPageView({ path: '/home/list/dealist' })
    },
    // 跳转二手房，租房列表
    async goToolPageView (type) {
      // 二手房列表
      if (type == 'sale') {
        this.toolsGoPageView(
          {
            path: '/home/list/secondhouseList', query: {
              uptown_id: this.salePostGetData.searchUptownId
            }
          }
        )
      } else {
        this.toolsGoPageView(
          {
            path: '/home/list/renthouseList', query: {
              uptown_id: this.salePostGetData.searchUptownId
            }
          }
        )
      }
      //把数据存在vuex里去
      await this.$store.commit('home/setScreenMergeListData', this.salePostGetData)
    },
    // 设置筛选的标题
    setDropTitle (tabType) {
      let tabName
      if (tabType == 'saleRenTab') {
        tabName = this.salePostGetData
      } else if (tabType == 'newTab') {
        tabName = this.newhousePostGetData
      } else if (tabType == 'dealTab') {
        tabName = this.dealPostGetData
      }
      // 选择区（如越秀区）
      if (!this.$commonUtils.utilCore.empty(tabName.setDistrict) && this.$commonUtils.utilCore.empty(tabName.setDistrictList)) {
        tabName.titleDistrict = tabName.setDistrict.name
      }
      // 选择区的街道（如东山口）
      if (!this.$commonUtils.utilCore.empty(tabName.setDistrict) && !this.$commonUtils.utilCore.empty(tabName.setDistrictList)) {
        if (tabName.setDistrictList.length == 1) {
          tabName.titleDistrict = tabName.setDistrictList[0].name
        } else {
          tabName.titleDistrict = '多选'
        }
        // 如果选择的是“不限”
        if (tabName.setDistrictList[0].id == '0') {
          tabName.titleDistrict = tabName.setDistrict.name
        }
      }
      // 选择地铁线（如1号线）
      if (!this.$commonUtils.utilCore.empty(tabName.setDistrictMetro.id) && this.$commonUtils.utilCore.empty(tabName.setDresslistMetro)) {
        tabName.titleDistrict = tabName.setDistrictMetro.name
      }
      // 选择地铁站（如西塱站）
      if (!this.$commonUtils.utilCore.empty(tabName.setDistrictMetro) && !this.$commonUtils.utilCore.empty(tabName.setDresslistMetro)) {
        if (tabName.setDresslistMetro.length == 1) {
          tabName.titleDistrict = tabName.setDresslistMetro[0].name
        } else {
          tabName.titleDistrict = '多选'
        }
        // 如果选择的是“不限”
        if (tabName.setDresslistMetro[0].id == '0') {
          tabName.titleDistrict = tabName.setDistrictMetro.name
        }
      }
      // 如果选择的是区域的不限  二级的“不限”
      if (tabName.setDistrict.name == '不限' || tabName.setDistrictMetro.name == '不限') {
        tabName.titleDistrict = '区域'
      }
      // 选择价格
      if (!this.$commonUtils.utilCore.empty(tabName.setPriceTabFirst) || !this.$commonUtils.utilCore.empty(tabName.setPriceTabSecond)) {
        if (!this.$commonUtils.utilCore.empty(tabName.setPriceTabFirst)) {
          if (tabName.setPriceTabFirst.length == 1) {
            tabName.titlePrice = tabName.setPriceTabFirst[0].name
          } else {
            tabName.titlePrice = '多选'
          }
        }
        // 选择价格
        if (!this.$commonUtils.utilCore.empty(tabName.setPriceTabSecond)) {
          if (tabName.setPriceTabSecond.length == 1) {
            tabName.titlePrice = tabName.setPriceTabSecond[0].name
          } else {
            tabName.titlePrice = '多选'
          }
        }
        if (tabName.setPriceTabFirst.length + tabName.setPriceTabSecond.length > 1) {
          tabName.titlePrice = '多选'
        }
      } else {
        tabName.titlePrice = '价格'
      }
      // 选择户型
      if (!this.$commonUtils.utilCore.empty(tabName.setHuxing)) {
        if (tabName.setHuxing.length == 1) {
          tabName.titleHuxing = tabName.setHuxing[0].name
        } else {
          tabName.titleHuxing = '多选'
        }
        // 如果选择的是“不限”
        if (this.$commonUtils.utilCore.empty(tabName.setHuxing[0].id)) {
          tabName.titleHuxing = '户型'
        }
      } else {
        tabName.titleHuxing = '户型'
      }
      // 如果选择的是成交列表的筛选
      if (tabType == 'dealTab') {
        if (!this.$commonUtils.utilCore.empty(tabName.setLeaseSale)) {
          tabName.titleType = tabName.setLeaseSale[0].name
        } else {
          tabName.titleType = '租/售类别'
        }
        if (!this.$commonUtils.utilCore.empty(tabName.setYear)) {
          // 如果选择的是“全部”
          if (this.$commonUtils.utilCore.empty(tabName.setYear[0].id)) {
            tabName.titleDealYear = '租/售类别'
          } else {
            tabName.titleDealYear = tabName.setYear[0].name
          }
        } else {
          tabName.titleDealYear = '成交年份'
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// 下拉菜单最大高度 UI图 8.46 + 1.32
$dropdownContent: 9.78rem;
// 下拉菜单确认按钮浮动起来  按钮高度 + padding-bottom 1rem
$dropdownBottomBtn: 1.64rem + 1rem;
.list {
  .fixed-container {
    width: 100%;
    position: fixed;
    top: 0;
    background-color: #fff;
    z-index: 9999;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0.1rem 0.32rem 0.18rem 0.35rem;

      .icon-return {
        width: 0.45rem;
        height: 0.4rem;
        padding-right: 0.4rem;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .header-input {
        width: 6.2rem;
        height: 0.68rem;
        box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5);
        border-radius: 1rem;
        position: relative;

        input {
          width: 100%;
          height: 100%;
          display: block;
          border: none;
          background: #f7f7f7;
          font-size: 0.28rem;
          border-radius: 1rem;
          padding-left: 0.66rem;
          padding-top: 0.15rem;
          box-sizing: border-box;
        }

        .icon-magnifier {
          width: 0.28rem;
          height: 0.28rem;
          position: absolute;
          top: 0.25rem;
          left: 0.26rem;
        }
      }
    }
    .house-type-box {
      .house-type-container {
        display: flex;
        align-items: center;
        padding: 0.04rem 0.28rem 0.22rem;
        .house-type-item {
          display: flex;
          align-items: center;
          padding: 0.14rem 0.18rem;
          border-radius: 1rem;
          margin-right: 0.12rem;

          .icon-housetype {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
            margin-right: 0.1rem;
          }

          .house-name {
            font-size: 0.24rem;
            font-weight: 500;
            color: #000000;
          }
        }
      }
    }
  }
  .house-sale-deal {
    display: flex;
    align-items: center;
    padding: 0.26rem 0.4rem 0;
    .saledeal-item {
      font-size: 0.28rem;
      font-weight: 400;
      color: #000000;
      position: relative;
      margin-right: 0.6rem;
      img {
        width: 0.35rem;
        height: 0.1rem;
        display: block;
        position: absolute;
        bottom: -0.1rem;
        right: 50%;
        transform: translate(0 -50%);
      }
    }
  }
  .screen-box {
    background-color: #fff;
    .search-condition {
      padding-top: 0.1rem;
      .house-region {
        .region-content {
          display: flex;
          // padding-bottom: 2.04rem;
          .region-left {
            font-size: 0.28rem;
            font-weight: 400;
            max-height: calc(#{$dropdownContent} - #{$dropdownBottomBtn});
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 1rem;
            background: #f0f0f0;
            ul {
              li {
                width: 1.74rem;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #000000;
              }
            }
          }
          .region-middle {
            max-height: calc(#{$dropdownContent} - #{$dropdownBottomBtn});
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 1rem;
            ul {
              li {
                width: 2.52rem;
                height: 0.8rem;
                font-size: 0.28rem;
                font-weight: 400;
                text-indent: 0.4rem;
                line-height: 0.8rem;
                color: #000000;
                background: #f8f8f8;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .region-right {
            max-height: calc(#{$dropdownContent} - #{$dropdownBottomBtn});
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 1rem;
            ul {
              li {
                height: 0.8rem;
                font-size: 0.28rem;
                font-weight: 400;
                color: #000000;
                padding-left: 0.4rem;
                padding-right: 0.38rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                span {
                  width: 2.15rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                img {
                  width: 0.3rem;
                  height: 0.3rem;
                }
              }
            }
          }
        }
      }
      .house-price {
        background-color: #fff;
        .price-tab {
          font-size: 0.32rem;
          font-weight: 400;
          color: #9b9b9b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1.1rem 0.12rem 1.12rem;
          .price-tab-active {
            font-weight: bold;
            color: #111111;
            &::after {
              content: "";
              display: block;
              width: 1.6rem;
              height: 0.08rem;
              margin-top: 0.1rem;
              margin-left: 0.04rem;
              background: #f7d447;
            }
          }
        }
        .price-content {
          padding-bottom: 0.5rem !important;
        }
      }
      .price-ipt {
        display: flex;
        align-items: center;
        padding-left: 0.66rem;
        padding-bottom: 0.72rem;
        input {
          width: 2.9rem;
          font-size: 0.36rem;
          font-weight: 400;
          border: none;
          border-radius: 0;
          text-align: center;
          box-sizing: border-box;
          border-bottom: 0.04rem solid #f8f8f8;
        }
        span {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
        }
      }
      .house-type {
        .type-content {
          padding: 0.3rem 0.3rem 0.72rem;
          display: flex;
          flex-wrap: wrap;
          .type-price {
            font-size: 0.26rem;
            font-weight: 400;
            color: #000000;
            background: #f5f5f5;
            border-radius: 0.04rem;
            margin-bottom: 0.28rem;
            margin-right: 0.26rem;
            padding: 0.2rem 0.07rem 0.18rem 0.07rem;
            white-space: nowrap;
          }
          .type-item {
            width: 1.48rem;
            height: 0.64rem;
            font-size: 0.26rem;
            font-weight: 400;
            color: #000000;
            text-align: center;
            line-height: 0.64rem;
            background: #f5f5f5;
            border-radius: 0.04rem;
            margin-bottom: 0.28rem;
            margin-right: 0.26rem;
            white-space: nowrap;
            &:nth-child(4n) {
              margin-right: 0;
            }
          }
        }
      }
      .house-more {
        .more-content {
          display: flex;
          align-items: flex-start;
          padding-bottom: 0.38rem;
          .more-left {
            font-size: 0.28rem;
            font-weight: 400;
            margin-right: 0.4rem;
            ul {
              li {
                width: 1.74rem;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #000000;
                background: #fafafa;
              }
            }
          }
          .more-right {
            display: flex;
            flex-wrap: wrap;
            padding-top: 0.3rem;
            .more-item {
              width: 1.48rem;
              height: 0.64rem;
              font-size: 0.26rem;
              font-weight: 400;
              color: #000000;
              text-align: center;
              line-height: 0.64rem;
              background: #f5f5f5;
              border-radius: 0.04rem;
              margin-right: 0.26rem;
              margin-bottom: 0.28rem;
            }
          }
        }
      }
      .house-sort {
        .sort-item {
          height: 0.84rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 0.84rem;
          border-bottom: 0.01rem solid #e5e5e5;
        }
      }

      /deep/ .van-dropdown-menu {
        .van-dropdown-menu__bar {
          box-shadow: none;
          padding-right: 0.2rem;
          border-bottom: 0.02rem solid #e6e6e6;
        }
        .van-dropdown-item__option {
          text-align: center;
        }
      }
    }
    .disk-source-type {
      padding: 0.26rem 0.1rem 0.26rem 0.3rem;
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      .disk-item {
        font-size: 0.22rem;
        font-weight: 400;
        color: #000000;
        background: #f8f8f8;
        padding: 0.2rem 0.25rem;
        margin-right: 0.2rem;
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
  }

  .selected-big-container {
    position: relative;
    .selected-container {
      max-height: 2.4rem;
      box-sizing: border-box;
      padding: 0.14rem 0.2rem 0 0.36rem;
      overflow: hidden;
      border-bottom: 0.04rem solid #f8f8f8;
      .selected-top {
        display: flex;
        align-items: baseline;
        .selected-title {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          white-space: nowrap;
        }
        .selected-content {
          width: 6rem;
          max-height: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          overflow: hidden;
          padding-top: 0.1rem;
          .selected-box {
            font-size: 0.24rem;
            font-weight: 400;
            color: #000000;
            background: #fef6d6;
            border-radius: 0.04rem;
            border: 0.02rem solid #ffce09;
            padding: 0.1rem 0.25rem;
            margin-right: 0.5rem;
            margin-bottom: 0.3rem;
            white-space: nowrap;
            position: relative;
            &:nth-last-child(1) {
              margin-right: 0;
            }
            // &:nth-child(3n) {
            //   margin-right: 0;
            // }
            .selected-close {
              position: absolute;
              right: -0.14rem;
              top: -0.12rem;
              img {
                width: 0.32rem;
                height: 0.32rem;
                display: block;
              }
            }
          }
        }
      }
      .selected-bottom {
        font-size: 0.26rem;
        font-weight: 400;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-top: 0.1rem;
        padding-bottom: 0.2rem;
        .selected-bottom-btn {
          position: relative;
          display: flex;
          align-items: center;
          white-space: nowrap;
          .icon-arrow {
            width: 0.22rem;
            height: 0.2rem;
            display: block;
            margin-right: 0.08rem;
          }
          .icon-empty {
            width: 0.23rem;
            height: 0.22rem;
            display: block;
            margin-right: 0.08rem;
          }
          &:nth-last-of-type(1):after {
            content: "";
            display: block;
            width: 0.02rem;
            height: 0.24rem;
            background: #d8d8d8;
            position: absolute;
            left: -0.4rem;
          }
        }
      }
    }
    .fixed-line {
      width: 100%;
      height: 0.1rem;
      background: #f0f0f0;
    }
  }
  .selected-more-container {
    position: relative;
    .selected-more-box {
      max-height: 1.98rem;
      padding: 0.4rem 0.2rem 0.28rem 0.34rem;
      box-sizing: border-box;
      display: flex;
      align-items: baseline;
      overflow: hidden;
      border-bottom: 0.04rem solid #f8f8f8;
      .selected-title {
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        white-space: nowrap;
      }
      .selected-content {
        width: 5.2rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .selected-box {
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          background: #fef6d6;
          border-radius: 0.04rem;
          border: 0.02rem solid #ffce09;
          padding: 0.1rem 0.25rem;
          margin-right: 0.5rem;
          margin-bottom: 0.3rem;
          white-space: nowrap;
          position: relative;
          &:nth-last-child(1) {
            margin-right: 0;
          }
          // &:nth-child(3n) {
          //   margin-right: 0;
          // }
          .selected-close {
            position: absolute;
            right: -0.14rem;
            top: -0.12rem;
            img {
              width: 0.32rem;
              height: 0.32rem;
              display: block;
            }
          }
        }
      }
      .selected-more {
        font-size: 0.28rem;
        font-weight: 400;
        color: #8d8d8d;
        display: flex;
        align-items: center;
        white-space: nowrap;
        position: absolute;
        bottom: 0.4rem;
        right: 0;
        transform: translate(-30%, 0);
        img {
          width: 0.22rem;
          height: 0.15rem;
          margin-left: 0.05rem;
        }
        &::after {
          content: "";
          display: block;
          width: 0.02rem;
          height: 0.24rem;
          background: #d8d8d8;
          position: absolute;
          left: -0.16rem;
        }
      }
    }
    .fixed-line {
      width: 100%;
      height: 0.1rem;
      background: #f0f0f0;
    }
  }
  .content-header {
    // padding-top: 4.1rem;
    .more-house {
      width: 6.5rem;
      height: 0.8rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.8rem;
      text-align: center;
      background: #fffbe7;
      margin: 0.2rem auto 0.4rem;
    }
  }
  .newhouse-box {
    height: 100vh;
    position: relative;
    .hidden-box {
      // width: 100px;
      // height: 100px;
      // background-color: red;
      position: absolute;
      top: -1.5rem;
      z-index: -999;
    }
    .newhouse-title {
      font-size: 0.34rem;
      font-weight: 400;
      color: #000000;
      padding: 0.32rem 0.4rem 0;
    }
  }
  .deal-container {
    .deal-box {
      padding: 0.4rem 0 0.36rem;
      margin: 0 0.54rem;
      border-bottom: 0.02rem solid #f0f0f0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .deal-left-box {
        width: 0.84rem;
        margin-right: 0.4rem;
        .deal-left {
          width: 0.84rem;
          height: 0.82rem;
          background: #87d730;
          font-size: 0.4rem;
          font-weight: 500;
          color: #ffffff;
          line-height: 0.82rem;
          text-align: center;
          border-radius: 50%;
          &.deal-active {
            background: #5ba8ff !important;
          }
        }
      }

      .deal-right {
        .deal-address {
          font-size: 0.3rem;
          font-weight: bold;
          color: #303030;
          line-height: 0.4rem;
        }
        .deal-label {
          font-size: 0.22rem;
          font-weight: 400;
          color: #000000;
        }
        .deal-time {
          font-size: 0.22rem;
          font-weight: 400;
          color: #000000;
        }
        .deal-price {
          padding-top: 0.05rem;
          display: flex;
          align-items: flex-end;
          .price-left {
            font-size: 0.3rem;
            font-weight: bold;
            color: #ff3100;
            padding-right: 0.1rem;
            .price-unit {
              font-size: 0.2rem;
            }
          }
          .price-right {
            font-size: 0.22rem;
            font-weight: 400;
            color: #999999;
          }
        }
        .rent-price {
          color: #ff3100;
          font-weight: bold;
          font-size: 0.2rem;
          display: flex;
          align-items: baseline;
          span {
            font-size: 0.3rem;
          }
        }
      }
      .deal-padbottom {
        padding-bottom: 0.1rem;
      }
    }
    .more-deal {
      width: 6.5rem;
      height: 0.8rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.8rem;
      text-align: center;
      background: #fffbe7;
      margin: 0.2rem auto 0.4rem;
    }
  }
  .deal-list-box {
    /deep/ .van-dropdown-menu__item {
      position: relative;
      &:not(:last-child) {
        &::after {
          content: "";
          display: block;
          width: 0.02rem;
          height: 0.37rem;
          background: #dfdfdf;
          position: absolute;
          right: 0;
        }
      }
      &:nth-child(2) {
        &::after {
          content: "";
          display: block;
          width: 0.02rem;
          height: 0.37rem;
          background: #dfdfdf;
          position: absolute;
          right: -0.15rem;
        }
      }
      &:nth-child(3) {
        &::after {
          content: "";
          display: block;
          width: 0.02rem;
          height: 0.37rem;
          background: #dfdfdf;
          position: absolute;
          right: -0.3rem;
        }
      }
    }
  }
  .every-nothing {
    font-size: 0.3rem;
    font-weight: 400;
    color: #737373;
    padding-top: 1.24rem;
    text-align: center;
  }
  .nothing-house {
    padding-top: 0.6rem;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .nothing-text {
      font-size: 0.3rem;
      font-weight: 400;
      color: #4c4c4c;
      padding-bottom: 0.2rem;
    }
    .empty-btn {
      font-size: 0.22rem;
      font-weight: 500;
      color: #ffa309;
      display: flex;
      align-items: center;
      img {
        width: 0.22rem;
        height: 0.22rem;
        margin-right: 0.04rem;
      }
    }
  }
  .reset-btn {
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    .btn-box {
      display: flex;
      align-items: center;
      padding: 0.3rem 0.4rem;
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 1.1rem;
        position: relative;
        img {
          width: 0.28rem;
          height: 0.28rem;
        }
        .text {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
        }
        &::after {
          content: "";
          width: 0.02rem;
          height: 0.44rem;
          background: #f2f2f2;
          position: absolute;
          top: 0.08rem;
          right: 0.56rem;
          display: block;
        }
      }
      .right {
        width: 4.94rem;
        height: 0.72rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.72rem;
        background: #f7d447;
        border-radius: 0.08rem;
      }
    }
  }
  .active {
    border: 0.02rem solid #ffce09 !important;
    background: #fef6d6 !important;
    // border-color: #207fef !important;
    // color: #207fef !important;
  }
  .house-title {
    font-size: 0.34rem;
    font-weight: 400;
    color: #000000;
    padding: 0.3rem 0 0 0.4rem;
  }
  .sort-active {
    background: #f7d447;
  }
  .type-active {
    width: 1.45rem !important;
    height: 0.6rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .type-active-price {
    background: #fef6d6;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .more-active {
    font-weight: bold;
    color: #f7d447 !important;
    background: #ffffff !important;
  }
  .choose-active {
    font-weight: 500;
    color: #000000;
  }
  .sale-box,
  .newhouse-box {
    /deep/ .van-dropdown-menu__bar .van-dropdown-menu__item {
      .van-dropdown-menu__title {
        color: #3a4143;
      }
      &:nth-last-of-type(1) {
        flex: 0.5 !important;
        .van-dropdown-menu__title {
          &::after {
            content: none;
          }
        }
      }
    }
  }
  .deal-list-box {
    /deep/ .van-dropdown-menu__bar .van-dropdown-menu__title {
      color: #3a4143;
    }
  }

  /deep/ .more-active {
    font-weight: bold;
    color: #f7d447 !important;
    background: #ffffff !important;
  }
  /deep/ .choose-active {
    font-weight: 500;
    color: #ffb90c !important;
    background: #ffffff !important;
    &::after {
      border-color: transparent transparent #ffb90c #ffb90c;
    }
  }
  .split-line {
    width: 100%;
    height: 0.2rem;
    background: #f8f8f8;
  }
  /deep/ .van-dropdown-item__content {
    max-height: $dropdownContent;
  }
  .rentSaleClass /deep/ .van-dropdown-item__content {
    width: 2rem;
    left: 1.82rem;
  }
  .dealYearClass /deep/ .van-dropdown-item__content {
    width: 2rem;
    left: 3.8rem;
  }
  .icon-sort {
    width: 0.23rem;
    height: 0.31rem;
    display: block;
  }
}
</style>
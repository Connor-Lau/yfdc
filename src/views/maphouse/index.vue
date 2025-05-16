<template>
  <!-- 地图选房 -->
  <div class="mapselection">
    <!-- 画圈边框 -->
    <div class="bg-img" v-show="isInDrawing">
      <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_border_bg.png'" alt="">
    </div>
    <!-- <gni-nav-bar :pageTitle="pageTitle" @onClickLeft="onClickLeft" :hideRight="false" ref="navBar"></gni-nav-bar> -->
    <div class="wrapper">
      <div class="map-container" id="container" ref="container">
      </div>
      <div class="nav-container" v-show="isNav && !isShowDraw">
        <div class="nav-top">
          <div class="nav-top-left" @click="onClickLeft">
            <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowLeft.png'" alt="">
          </div>
          <div class="nav-top-right">
            <div class="options-item" v-for="(item,index) in options" :key="index+1"
              :class="{'options-active':optionsIndex==index}" @click="changeOptions(item,index)">{{item.text}}
              <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_artboard.png'" alt=""
                :style="optionsIndex==0?'left:0.22rem':''" v-show="optionsIndex == item.id">
            </div>
          </div>
        </div>
        <div class="nav-middle" @click="toolsGoPageView({
  path: '/maphouse/map-search',query:{typeIndex:optionsIndex}
})">
          <search-new v-model="searchValue" :placeholder="showPlaceholder" :waitTime="500"
            searchBoxStyle="margin: 0 0.28rem 0.08rem !important;" :clear="false" inputStyle="fontSize:0.28rem;"></search-new>
        </div>
        <div class="nav-bottom map-nav-bottom">
          <van-dropdown-menu active-color="#323233" :close-on-click-outside="false" :z-index='999' :style="{'--borderRadius':borderRadius}">
            <van-dropdown-item :title="titleDistrict" ref="districtMap" :title-class="districtMap" @opened="handleDropdownClone(1)"
              @close="handleDropdownClone()">
              <div class="house-region">
                <div class="region-content">
                  <div class="region-left" style="maxHeight:4.7rem">
                    <ul>
                      <li @click="selectTabArea(0,'district','mapTab')" :class="mapGetData.tabAreaIndex == 0 ? 'region-active':''">区域</li>
                      <li @click="selectTabArea(1,'district','mapTab')" :class="mapGetData.tabAreaIndex == 1 ? 'region-active':''"
                        v-if="districtMetro.length>1">地铁</li>
                      <li @click="selectTabArea(2,'district','mapTab')" :class="mapGetData.tabAreaIndex == 2 ? 'region-active':''">附近</li>
                    </ul>
                  </div>
                  <template v-if="mapGetData.tabAreaIndex == 0">
                    <div class="region-middle" style="maxHeight:4.7rem">
                      <ul>
                        <li v-for="(item,index) in district" :key="item.id"
                          :class="mapGetData.setDistrict && mapGetData.setDistrict.hasOwnProperty('id') && mapGetData.setDistrict.id== item.id  ? 'more-active':''"
                          @click="chooseDistrict(item,'mapTab')">{{item.name}}</li>
                      </ul>
                    </div>
                    <div class="region-right" ref="scrollRight" style="maxHeight:4.7rem">
                      <ul>
                        <li v-for="(item,index) in addresslist" :key="item.id" @click="chooseDistrictAddress(item,'district',true,false,'mapTab')" :class="checkArrayValue(mapGetData.setDistrictList,'id',item.id)==-1?'':'more-active'">
                          <span>{{item.name}}</span>
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt=""
                            v-if="checkArrayValue(mapGetData.setDistrictList,'id',item.id)==-1">
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-else>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <!-- 地铁 -->
                  <template v-if="mapGetData.tabAreaIndex == 1">
                    <div class="region-middle" style="maxHeight:4.7rem">
                      <ul>
                        <li v-for="(item,index) in districtMetro" :key="item.id"
                          :class="mapGetData.setDistrictMetro && mapGetData.setDistrictMetro.hasOwnProperty('id') && mapGetData.setDistrictMetro.id== item.id  ? 'more-active':''"
                          @click="chooseDistrict(item,'mapTab')">{{item.name}}</li>
                      </ul>
                    </div>
                    <div class="region-right" ref="scrollRight" style="maxHeight:4.7rem">
                      <ul>
                        <li v-for="(item,index) in addresslistMetro" :key="item.id"
                          @click="chooseDistrictAddress(item,'district',true,false,'mapTab')" :class="checkArrayValue(mapGetData.setDresslistMetro,'id',item.id)==-1?'':'more-active'">
                          <span>{{item.name}}</span>
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt=""
                            v-if="checkArrayValue(mapGetData.setDresslistMetro,'id',item.id)==-1">
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-else>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <template v-if="mapGetData.tabAreaIndex == 2">
                    <div class="region-nearby">
                      <div class="nearby-item" v-for="(item,index) in nearByList" :key="index+1" :class="mapGetData.setNearby && mapGetData.setNearby.hasOwnProperty('id') && mapGetData.setNearby.id== item.id  ? 'more-active':''"
                        @click="chooseDistrict(item,'mapTab')">
                        <div class="nearby-item-left">{{item.name}}</div>
                        <div class="nearby-item-right">
                          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_selected.png'" alt=""
                            v-if="mapGetData.setNearby && (mapGetData.setNearby.id==item.id)">
                          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_moreselect.png'" alt="" v-else>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="reset-btn">
                  <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(mapGetData.setSelected)">
                    <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                      <div class="selected-title">已选：</div>
                      <div class="selected-content">
                        <div class="selected-box" v-for="(item,index) in mapGetData.setSelected" :key="index+1">
                          {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                          <div class="selected-close" @click="deleteSelected(item,index,'mapTab')">
                            <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                          </div>
                        </div>
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                        更多
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                        收起
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="btn-box">
                    <div class="left" @click="resetFunciton('district','mapTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                      <div class="text">重置</div>
                    </div>
                    <div @click="closeDropdownMenu('districtMap',true,'mapTab')" class="right">确定</div>
                  </div>
                </div>
              </div>
            </van-dropdown-item>
            <van-dropdown-item :title="optionsIndex==2?'租金':'价格'" ref="priceTabMap" :title-class="priceTabMap" @opened="handleDropdownClone(1)"
              @close="handleDropdownClone()">
              <div class="house-price house-type house-postbox">
                <div class="type-title">价格区间 ({{optionsIndex==2?'元':'万'}})</div>
                <div class="price-ipt">
                  <input type="number" class="_iosKeyboardInput" v-model="mapGetData.setPriceFirstVal[0]"
                    :placeholder="'最低总价('+(optionsIndex==2?'元':'万')+')'" @keyup="checkPriceInput(0,'mapTab')">
                  <span>至</span>
                  <input type="number" class="_iosKeyboardInput" v-model="mapGetData.setPriceFirstVal[1]"
                    :placeholder="'最高总价('+(optionsIndex==2?'元':'万')+')'" @keyup="checkPriceInput(1,'mapTab')">
                </div>
                <div class="type-content price-content">
                  <div class="type-item" v-for="(item,index) in priceTabFirst" :key="index+'map'" @click="chooseDistrictAddress(item,'priceTab',true,false,'mapTab')"
                    :class="checkArrayValue(mapGetData.setPriceTabFirst,'id',item.id) != -1?'type-active':''" v-show="optionsIndex==0">{{item.name}}
                  </div>
                  <div class="type-map-price" v-for="(item,index) in priceTabFirst" :key="index+1" @click="chooseDistrictAddress(item,'priceTab',true,false,'mapTab')"
                    :class="checkArrayValue(mapGetData.setPriceTabFirst,'id',item.id) != -1?'type-map-price-active':''" v-show="optionsIndex==2">{{item.name}}
                  </div>
                </div>
                <div class="reset-btn">
                  <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(mapGetData.setSelected)">
                    <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                      <div class="selected-title">已选：</div>
                      <div class="selected-content">
                        <div class="selected-box" v-for="(item,index) in mapGetData.setSelected" :key="index+1">
                          {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                          <div class="selected-close" @click="deleteSelected(item,index,'mapTab')">
                            <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                          </div>
                        </div>
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                        更多
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                        收起
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="btn-box">
                    <div class="left">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                      <div @click="resetFunciton('priceTab','mapTab')" class="text">重置</div>
                    </div>
                    <div @click="closeDropdownMenu('priceTabMap',true,'mapTab')" class="right">确定</div>
                  </div>
                </div>
              </div>
            </van-dropdown-item>
            <van-dropdown-item title="户型" ref="huxingMap" :title-class="huxingMap" @opened="handleDropdownClone(1)"
              @close="handleDropdownClone()">
              <div class="house-type">
                <div class="type-title">户型选择</div>
                <div class="type-content">
                  <div class="type-item" v-for="(item,index) in huxing" :key="item.id"
                    @click="chooseDistrictAddress(item,'huxing',true,false,'mapTab')"
                    :class="checkArrayValue(mapGetData.setHuxing,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                </div>
                <div class="reset-btn">
                  <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(mapGetData.setSelected)">
                    <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                      <div class="selected-title">已选：</div>
                      <div class="selected-content">
                        <div class="selected-box" v-for="(item,index) in mapGetData.setSelected" :key="index+1">
                          {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                          <div class="selected-close" @click="deleteSelected(item,index,'mapTab')">
                            <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                          </div>
                        </div>
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                        更多
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                        收起
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="btn-box">
                    <div class="left" @click="resetFunciton('huxing','mapTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                      <div class="text">重置</div>
                    </div>
                    <div @click="closeDropdownMenu('huxingMap',true,'mapTab')" class="right">确定</div>
                  </div>
                </div>
              </div>
            </van-dropdown-item>
            <van-dropdown-item title="面积" ref="areaMap" :title-class="areaMap" @opened="handleDropdownClone(1)"
              @close="handleDropdownClone()">
              <div class="house-type">
                <div class="type-title">面积选择</div>
                <div class="type-content">
                  <div class="type-item" v-for="(item,index) in moreArea" :key="item.id"
                    @click="chooseDistrictAddress(item,'area',true,false,'mapTab')"
                    :class="checkArrayValue(mapGetData.setMoreArea,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                </div>
                <div class="reset-btn">
                  <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(mapGetData.setSelected)">
                    <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                      <div class="selected-title">已选：</div>
                      <div class="selected-content">
                        <div class="selected-box" v-for="(item,index) in mapGetData.setSelected" :key="index+1">
                          {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                          <div class="selected-close" @click="deleteSelected(item,index,'mapTab')">
                            <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                          </div>
                        </div>
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                        更多
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                        收起
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="btn-box">
                    <div class="left" @click="resetFunciton('area','mapTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                      <div class="text">重置</div>
                    </div>
                    <div @click="closeDropdownMenu('areaMap',true,'mapTab')" class="right">确定</div>
                  </div>
                </div>
              </div>
            </van-dropdown-item>
            <van-dropdown-item title="更多" ref="moreTitleMap" :title-class="moreTitleMap" @opened="handleDropdownClone(1)"
              @close="handleDropdownClone()">
              <div class="house-more house-postbox">
                <div class="more-content">
                  <div class="more-left">
                    <ul>
                      <li @click="selectTabArea(0,'moreTitle','mapTab')" :class="mapGetData.moreTitle == 0 ? 'more-active':''">物业类型</li>
                      <li @click="selectTabArea(1,'moreTitle','mapTab')" :class="mapGetData.moreTitle == 1 ? 'more-active':''">装修情况</li>
                    </ul>
                  </div>
                  <div class="more-right" v-if="mapGetData.moreTitle == 0">
                    <div class="more-right-title">物业类型</div>
                    <div class="more-item-content">
                      <div class="more-item" v-for="(item,index) in morePropertyType" :key="item.id" @click="chooseDistrictAddress(item,'moreTitle',true,false,'mapTab')" :class="checkArrayValue(mapGetData.setMorePropertyType,'id',item.id) != -1?'type-more-active':''" style="width:1.4rem">
                        {{item.name}}
                      </div>
                    </div>
                  </div>
                  <div class="more-right" v-if="mapGetData.moreTitle == 1">
                    <div class="more-right-title">装修情况</div>
                    <div class="more-item-content">
                      <div class="more-item" v-for="(item,index) in moreRenovation" :key="item.id" @click="chooseDistrictAddress(item,'moreTitle',true,false,'mapTab')" :class="checkArrayValue(mapGetData.setMoreRenovation,'id',item.id) != -1?'type-more-active':''" style="width:1.4rem">
                        {{item.name}}
                      </div>
                    </div>

                  </div>
                </div>
                <div class="reset-btn">
                  <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(mapGetData.setSelected)">
                    <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                      <div class="selected-title">已选：</div>
                      <div class="selected-content">
                        <div class="selected-box" v-for="(item,index) in mapGetData.setSelected" :key="index+1">
                          {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                          <div class="selected-close" @click="deleteSelected(item,index,'mapTab')">
                            <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                          </div>
                        </div>
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                        更多
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                      </div>
                      <div class="selected-more" v-show="mapGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                        收起
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="btn-box">
                    <div class="left" @click="resetFunciton('moreTitle','mapTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                      <div class="text">重置</div>
                    </div>
                    <div @click="closeDropdownMenu('moreTitleMap',true,'mapTab')" class="right">确定</div>
                  </div>
                </div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      <!-- 退出 重画功能 -->
      <div class="btn-draw" v-show="isShowDraw">
        <div class="draw-item" @click="handleClick('close')">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_sign_out.png'" alt="">
          <span>退出</span>
        </div>
        <div class="draw-item" @click="handleClick('redraw')">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_draw_again01.png'" alt="" v-if="countIsDraw">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_draw_again.png'" alt="" v-else>
          <span :style="{'color':countIsDraw?'#CCCCCC':'#000000'}">重画</span>
        </div>
      </div>
      <div class="fun-box" v-show="!isShowDraw">
        <div class="fun-btn" @click="geoCoder()">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_fixed.png'" alt="">
          <div class="btn-name">定位</div>
          <div class="fun-line"></div>
        </div>
        <div class="fun-btn" @click="handleClick('open')">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_drawcircle.png'" alt="">
          <div class="btn-name">画圈</div>
          <div class="fun-line"></div>
        </div>
        <div class="fun-btn" @click="resetFunciton('map','mapTab',true)">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/iocn_reset.png'" alt="">
          <div class="btn-name">重置</div>
        </div>
        <transition name="van-fade">
          <div class="fun-draw-tips" v-show="drawTips">请放大地图后使用画圈找房</div>
        </transition>
      </div>
      <div class="number-house" v-show="isShowNumHouse">
        可视范围内共<span>{{dataList.result_num}}</span>套房源
      </div>
      <div class="number-house" v-show="isShowDraw && drawNum>0" @click="goDrawList">
        区域内共找到<span>{{drawNum}}</span>套房源/楼盘
        <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowRight.png'" alt="">
      </div>
    </div>
    <van-popup v-model="showHouse" position="bottom" :style="{ height: popHeight+'%'}" ref="popRef" :class=" `${openAniRise?'pop-rise':''}${openAniDescend?'pop-descend':''}`" :overlay="false">
      <div class="pop-container" v-show="popHeight==50 || popHeight == 20" ref="popContainer">
        <div class="pop-header" ref="popHeader">
          <div class="pop-arrow-top" @click="changeHeight" v-show="optionsIndex!=1">
            <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowTop.png'" alt="">
          </div>
          <div class="pop-arrow-top" @click="changeHeight" v-show="optionsIndex==1">
            <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowBottom.png'" alt="">
          </div>
          <div class="pop-info" v-show="optionsIndex!=1">
            <div class="info-name" @click="toolsGoPageView({path: '/home/detail/housevillage',query:{id:uptowndata.uptown_id,housetype:optionsIndex==2?'1':'0', longitude:uptowndata.longitude,latitude:uptowndata.latitude,cityId:uptowndata.site_id,pageFrom:'maphouse'}})">
              {{uptowndata.uptown_name}}
              <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowRight02.png'" alt="">
            </div>
            <div class="info-lable">
              <div class="label-address">
                <div class="address" v-show="uptowndata.district_name">{{setDistrict(uptowndata.district_name)}}</div>在{{optionsIndex==0?'售':'租'}}{{sellRentNum}}套
              </div>
              <div class="label-price" v-show="optionsIndex==0">
                均价
                <span>{{countAvagePrice(uptowndata.average_price!=0?uptowndata.average_price:uptowndata.avg_price)}}元/平</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pop-box" :style="{height:popTop+'px'}"></div>
        <div class="pop-house" v-if="!$commonUtils.utilCore.empty(popHouseList) && !listGetData.loading" :style="{height:popListHeight+'px'}">
          <houselistItem :list="popHouseList" @goDetail="goDetail" v-show="optionsIndex!=1">
          </houselistItem>
          <newhouselistItem :list="popHouseList" @goDetail="goDetail" :isNewHouse="true" v-show="optionsIndex==1"></newhouselistItem>
        </div>
        <div class="pop-nothing" v-if="$commonUtils.utilCore.empty(popHouseList) && !listGetData.loading && lockLoading">该筛选条件暂无房源，请重新筛选</div>
      </div>
      <div class="pop-screen-container" v-show="popHeight=='100' ">
        <div class="fixed-container">
          <div class="screen-top">
            <gni-nav-bar @onClickLeft="changeHeight" :pageTitle="uptowndata.uptown_name" :hideRight="false" :hideLeft="false">
              <template slot="slot-left">
                <div class="icon-return">
                  <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowBottom02.png'" alt="">
                </div>
              </template>
            </gni-nav-bar>
          </div>
          <div class="screen-drop nav-bottom">
            <van-dropdown-menu active-color="#000000" :close-on-click-outside="false" :z-index='999'>
              <!-- <van-dropdown-item title="区域" ref="district" :title-class="districtClass" @opened="handleDropdownClone(1)"
              @close="handleDropdownClone()">
              <div class="house-region">
                <div class="region-content">
                  <div class="region-left">
                    <ul>
                      <li @click="selectTabArea(0,'district','listTab')" :class="listGetData.tabAreaIndex == 0 ? 'more-active':''">区域</li>
                      <li @click="selectTabArea(1,'district','listTab')" :class="listGetData.tabAreaIndex == 1 ? 'more-active':''"
                        v-if="districtMetro.length>1">地铁</li>
                    </ul>
                  </div>
                  <template v-if="listGetData.tabAreaIndex == 0">
                    <div class="region-middle">
                      <ul>
                        <li v-for="(item,index) in district" :key="item.id"
                          :class="listGetData.setDistrict && listGetData.setDistrict.hasOwnProperty('id') && listGetData.setDistrict.id== item.id  ? 'more-active':''"
                          @click="chooseDistrict(item,'listTab')">{{item.name}}</li>
                      </ul>
                    </div>
                    <div class="region-right" ref="scrollRight">
                      <ul>
                        <li v-for="(item,index) in addresslist" :key="item.id" @click="chooseDistrictAddress(item,'district',true,false,'listTab')">
                          <span
                            :class="checkArrayValue(listGetData.setDistrictList,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_moreselect.png'" alt=""
                            v-if="checkArrayValue(listGetData.setDistrictList,'id',item.id)==-1">
                          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_selected.png'" alt="" v-else>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <template v-if="listGetData.tabAreaIndex == 1">
                    <div class="region-middle">
                      <ul>
                        <li v-for="(item,index) in districtMetro" :key="item.id"
                          :class="listGetData.setDistrictMetro && listGetData.setDistrictMetro.hasOwnProperty('id') && listGetData.setDistrictMetro.id== item.id  ? 'more-active':''"
                          @click="chooseDistrict(item,'listTab')">{{item.name}}</li>
                      </ul>
                    </div>
                    <div class="region-right" ref="scrollRight">
                      <ul>
                        <li v-for="(item,index) in addresslistMetro" :key="item.id"
                          @click="chooseDistrictAddress(item,'district',true,false,'listTab')">
                          <span
                            :class="checkArrayValue(listGetData.setDresslistMetro,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_moreselect.png'" alt=""
                            v-if="checkArrayValue(listGetData.setDresslistMetro,'id',item.id)==-1">
                          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_selected.png'" alt="" v-else>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="reset-btn">
                  <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(listGetData.setSelected)">
                    <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                      <div class="selected-title">已选：</div>
                      <div class="selected-content">
                        <div class="selected-box" v-for="(item,index) in listGetData.setSelected" :key="index+1">
                          {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                          <div class="selected-close" @click="deleteSelected(item,index,'listTab')">
                            <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                          </div>
                        </div>
                      </div>
                      <div class="selected-more" v-show="listGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                        更多
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                      </div>
                      <div class="selected-more" v-show="listGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                        收起
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="btn-box">
                    <div class="left" @click="resetFunciton('district','listTab')">
                      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                      <div class="text">重置</div>
                    </div>
                    <div @click="closeDropdownMenu('district',true,'listTab')" class="right">确定</div>
                  </div>
                </div>
              </div>
            </van-dropdown-item> -->
              <van-dropdown-item title="价格" ref="priceTab" :title-class="priceTabClass" @opened="handleDropdownClone(1)"
                @close="handleDropdownClone()">
                <div class="house-price house-type">
                  <div class="price-tab">
                    <div class="tab-first" @click="selectTabArea(0,'priceTab','listTab')"
                      :class="listGetData.tabPriceIndex == 0?'price-tab-active':''">{{optionsIndex==2?'租金(元)':'总价 (万/套)'}}</div>
                    <div class="tab-second" @click="selectTabArea(1,'priceTab','listTab')"
                      :class="listGetData.tabPriceIndex == 1?'price-tab-active':''" v-show="optionsIndex != 2">单价 (万/㎡)</div>
                  </div>
                  <template v-if="listGetData.tabPriceIndex == 0">
                    <div class="type-content price-content">
                      <div class="type-item" v-for="(item,index) in priceTabFirst" :key="index+'list'"
                        @click="chooseDistrictAddress(item,'priceTab',true,false,'listTab')"
                        :class="checkArrayValue(listGetData.setPriceTabFirst,'id',item.id) != -1?'type-active':''" v-show="optionsIndex!=2">{{item.name}}
                      </div>
                      <div class="type-price" v-for="(item,index) in priceTabFirst" :key="item.id"
                        @click="chooseDistrictAddress(item,'priceTab',true,false,'listTab')"
                        :class="checkArrayValue(listGetData.setPriceTabFirst,'id',item.id) != -1?'type-active-price':''" v-show="optionsIndex==2">{{item.name}}
                      </div>
                    </div>
                    <div class="price-ipt">
                      <input type="number" class="_iosKeyboardInput" v-model="listGetData.setPriceFirstVal[0]"
                        :placeholder="'最低总价('+(optionsIndex==2?'元':'万')+')'" @keyup="checkPriceInput(0,'listTab')">
                      <span>至</span>
                      <input type="number" class="_iosKeyboardInput" v-model="listGetData.setPriceFirstVal[1]"
                        :placeholder="'最高总价('+(optionsIndex==2?'元':'万')+')'" @keyup="checkPriceInput(1,'listTab')">
                    </div>
                  </template>
                  <template v-if="listGetData.tabPriceIndex == 1 && optionsIndex != 2">
                    <div class="type-content price-content">
                      <div class="type-item" v-for="(item,index) in priceTabSecond" :key="item.id"
                        @click="chooseDistrictAddress(item,'priceTab',true,false,'listTab')"
                        :class="checkArrayValue(listGetData.setPriceTabSecond,'id',item.id) != -1?'type-active':''">
                        {{item.name}}
                      </div>
                    </div>
                    <div class="price-ipt">
                      <input type="number" class="_iosKeyboardInput" v-model="listGetData.setPriceSecondVal[0]"
                        placeholder="最低单价(万)" @keyup="checkPriceInput(0,'listTab')">
                      <span>至</span>
                      <input type="number" class="_iosKeyboardInput" v-model="listGetData.setPriceSecondVal[1]"
                        placeholder="最高单价(万)" @keyup="checkPriceInput(1,'listTab')">
                    </div>
                  </template>
                  <div class="reset-btn">
                    <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(listGetData.setSelected)">
                      <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                        <div class="selected-title">已选：</div>
                        <div class="selected-content">
                          <div class="selected-box" v-for="(item,index) in listGetData.setSelected" :key="index+1">
                            {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                            <div class="selected-close" @click="deleteSelected(item,index,'listTab')">
                              <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                          更多
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                          收起
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="btn-box">
                      <div class="left">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div @click="resetFunciton('priceTab','listTab')" class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('priceTab',true,'listTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item title="户型" ref="huxing" :title-class="huxingClass" @opened="handleDropdownClone(1)"
                @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-title">户型选择</div>
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in huxing" :key="item.id"
                      @click="chooseDistrictAddress(item,'huxing',true,false,'listTab')"
                      :class="checkArrayValue(listGetData.setHuxing,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="reset-btn">
                    <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(listGetData.setSelected)">
                      <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                        <div class="selected-title">已选：</div>
                        <div class="selected-content">
                          <div class="selected-box" v-for="(item,index) in listGetData.setSelected" :key="index+1">
                            {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                            <div class="selected-close" @click="deleteSelected(item,index,'listTab')">
                              <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                          更多
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                          收起
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('huxing','listTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('huxing',true,'listTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item title="面积" ref="area" :title-class="areaClass" @opened="handleDropdownClone(1)"
                @close="handleDropdownClone()">
                <div class="house-type">
                  <div class="type-title">面积选择</div>
                  <div class="type-content">
                    <div class="type-item" v-for="(item,index) in moreArea" :key="item.id"
                      @click="chooseDistrictAddress(item,'area',true,false,'listTab')"
                      :class="checkArrayValue(listGetData.setMoreArea,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                  </div>
                  <div class="reset-btn">
                    <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(listGetData.setSelected)">
                      <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                        <div class="selected-title">已选：</div>
                        <div class="selected-content">
                          <div class="selected-box" v-for="(item,index) in listGetData.setSelected" :key="index+1">
                            {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                            <div class="selected-close" @click="deleteSelected(item,index,'listTab')">
                              <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                          更多
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                          收起
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('area','listTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('area',true,'listTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
              <van-dropdown-item title="更多" ref="moreTitle" :title-class="moreTitleClass" @opened="handleDropdownClone(1)"
                @close="handleDropdownClone()">
                <div class="house-more">
                  <div class="more-content">
                    <div class="more-left">
                      <ul>
                        <li @click="selectTabArea(0,'moreTitle','listTab')" :class="listGetData.moreTitle == 0 ? 'more-active':''">物业类型</li>
                        <li @click="selectTabArea(1,'moreTitle','listTab')" :class="listGetData.moreTitle == 1 ? 'more-active':''">装修情况</li>
                      </ul>
                    </div>
                    <div class="more-right" v-if="listGetData.moreTitle == 0">
                      <div class="more-right-title">物业类型</div>
                      <div class="more-item-content">
                        <div class="more-item" v-for="(item,index) in morePropertyType" :key="item.id" @click="chooseDistrictAddress(item,'moreTitle',true,false,'listTab')" :class="checkArrayValue(listGetData.setMorePropertyType,'id',item.id) != -1?'type-active':''">
                          {{item.name}}
                        </div>
                      </div>
                    </div>
                    <div class="more-right" v-if="listGetData.moreTitle == 1">
                      <div class="more-right-title">装修情况</div>
                      <div class="more-item-content">
                        <div class="more-item" v-for="(item,index) in moreRenovation" :key="item.id" @click="chooseDistrictAddress(item,'moreTitle',true,false,'listTab')" :class="checkArrayValue(listGetData.setMoreRenovation,'id',item.id) != -1?'type-active':''">
                          {{item.name}}
                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="reset-btn">
                    <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(listGetData.setSelected)">
                      <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                        <div class="selected-title">已选：</div>
                        <div class="selected-content">
                          <div class="selected-box" v-for="(item,index) in listGetData.setSelected" :key="index+1">
                            {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                            <div class="selected-close" @click="deleteSelected(item,index,'listTab')">
                              <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && !isShowmore" @click="handleMore('more')">
                          更多
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                        </div>
                        <div class="selected-more" v-show="listGetData.setSelected.length>3 && isShowmore" @click="handleMore('more')">
                          收起
                          <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="btn-box">
                      <div class="left" @click="resetFunciton('moreTitle','listTab')">
                        <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                        <div class="text">重置</div>
                      </div>
                      <div @click="closeDropdownMenu('moreTitle',true,'listTab')" class="right">确定</div>
                    </div>
                  </div>
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
          <div class="screen-source-type">
            <div class="disk-item" v-for="(item,index) in diskSourceType" :key="item.id" @click="chooseDistrictAddress(item,'diskSourceType',true,false,'listTab')" :class="checkArrayValue(listGetData.setDiskIndex,'id',item.id) != -1?'disk-active':''">
              {{item.name}}
            </div>
          </div>
          <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(listGetData.setSelectedShow)">
            <div class="selected-container" :style="isShow?'max-height:100%':''">
              <div class="selected-title">已选：</div>
              <div class="selected-content">
                <div class="selected-box" v-for="(item,index) in listGetData.setSelectedShow" :key="index+1">
                  {{item.type=='district' && item.tabAreaIndex=='1'?setDresslistMetroText(item.name):item.name}}
                  <div class="selected-close" @click="deleteSelectedShow(item,'listTab')">
                    <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                  </div>
                </div>
              </div>
              <div class="selected-more" v-show="selectedLength>3 && !isShow" @click="handleMore('select')">
                更多
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
              </div>
              <div class="selected-more" v-show="selectedLength>3 && isShow" @click="handleMore('select')">
                收起
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
              </div>
            </div>
            <div class="fixed-line"></div>
          </div>
        </div>
        <div class="screen-list" :style="{'padding-top':navheight+'px'}">
          <van-list @load="actOnLoad"
            v-model="listGetData.loading"
            :finished="listGetData.finished"
            :immediate-check="false"
            finished-text="没有更多了">
            <houselistItem :list="popHouseList" @goDetail="goDetail"></houselistItem>
          </van-list>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
import searchNew from "@/components/gni/gni-search.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
import { mapState, mapActions, mapMutations } from "vuex";
import mapJS from './js/map.js'
export default {
  components: { gniNavBar, searchNew, houselistItem, newhouselistItem },
  data () {
    return {
      pageTitle: "地图选房",
      navheight: 0, // 导航高度
      headTitle: '越秀岭南雅筑',
      newMap: {},
      markerList: [],//存储地图上marker的数组
      blockList: [], //存储地图上label的数组(地铁线路的点)
      metroList: [],//存储地图地铁label的数组(地铁站的点)
      cirCleList: [], // 存储地图圆圈的数组
      buslineData: {}, // 创建地铁线的构造函数
      isInDrawing: false,//是否处于画圈状态下
      isMouseDown: false,//是否处于鼠标左键按下状态下
      isShowDraw: false, // 画了一次后不能再次画（需点重画）
      isNav: true, // 是否隐藏导航栏
      polyPointArray: [],//存储画出折线点的数组
      lastPolyLine: null,//上次操作画出的折线
      polygonAfterDraw: null,//画圈完成后生成的多边形
      oldCircle: null, // 上次画出的圆
      options: [
        {
          id: 0,
          text: '二手房',
          val: 'sale'
        },
        {
          id: 1,
          text: '新房',
          val: 'house'
        },
        {
          id: 2,
          text: '租房',
          val: 'rent'
        }
      ],
      nearByList: [
        {
          id: "",
          name: '不限',
          val: '',
        },
        {
          id: 1,
          name: '1km',
          val: '1000'
        },
        {
          id: 2,
          name: '2km',
          val: '2000'
        },
        {
          id: 3,
          name: '3km',
          val: '3000'
        }
      ],
      optionsIndex: 0,
      searchValue: '', //搜索的数据
      showPlaceholder: '你想住在哪？',
      // 区域
      district: [],
      //区域地址
      addresslist: [],
      // 地铁区域(线路)
      districtMetro: [],
      //地铁区域地址(站点)
      addresslistMetro: [],
      priceTabFirst: [],//价格区间列表（新房二手房）
      priceTabSecond: [],//单价列表(新房)
      huxing: [],//户型
      moreArea: [],//建筑面积列表
      morePropertyType: [],//物业类型
      moreRenovation: [],//装修情况
      mapGetData: { //搜索选择的条件
        bounds_max_lng: "",//	新增 否	string	最大经度
        bounds_min_lng: "",//	新增 否	string	最小经度
        bounds_max_lat: "",//新增 否	string	最大纬度
        bounds_min_lat: "",//新增 否	string	最小纬度
        zoom: "11",//新增 否	string	地图缩放比例
        longitude: "",//	新增 否	string	经度(定位)
        latitude: "",// 新增 否	string	纬度(定位)
        tabAreaIndex: 0,//区域tab切换 
        moreTitle: 0, // “更多”导航的标题选项
        tabPriceIndex: 0, // 价格tab切换
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setNearby: {}, // 区域-附近
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
        setSelected: [],// 已选中的
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        city_id: 8,//	否	string	城市id 默认8
        searchUptownId: '', // 小区id
        loading: false,//列表数据加载中
        finished: false,//列表数据已经加载完毕
      },
      listGetData: {
        tabAreaIndex: 0,//区域tab切换 
        moreTitle: 0, // “更多”导航的标题选项
        tabPriceIndex: 0, // 价格tab切换
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
        setSelected: [],// 已选中的（下拉框的展示）
        setSelectedShow: [],// 已选中的(列表顶部的展示)
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        inputKeyWord: "",//
        city_id: 8,//	否	string	城市id 默认8
        page: 0,//	否	string	页码 默认1
        page_size: 10,//	否	string	每页显示数 默认10
        searchUptownId: '', // 小区id
        loading: false,//列表数据加载中
        finished: false,//列表数据已经加载完毕
      },
      isShowmore: false,
      selectedMore: [], // “更多”已选中的数据
      isClosed: false,
      cloneObject: {}, //深拷贝筛选点击确定后的数据
      showHouse: false,// 房子弹出层
      popHeight: '50',
      popHouseList: [], // 弹窗在售房源
      diskSourceType: [],
      openAniRise: false, // 动画状态
      openAniDescend: false,// 动画状态
      drawTips: false,
      dataList: {}, // 所有数据
      drawNum: 0, // 画完圈之后显示的套数
      uptowndata: {}, // 点击小区存储的数据
      clickLabel: [], // 点击过的clickLabel（记录判断）
      clickLabelId: [], // 点击过的小区id
      clickUptownId: '', // 记录当前点击的小区id
      moveX: 0, // 移动的x轴距离
      isMove: false, //  是否移动了地图（区分点击事件）
      sellRentNum: 0, // 在售（租）多少套
      isShow: false,
      selectedLength: '', // 已选中的长度，避免报错
      pageFrom: "",//页面来源路径
      cloneSearchData: {},
      isOpenMetro: false, // 是否开启了线路图
      dataMetroList: {},
      cityInfo: {}, // 定位的城市信息
      titleDistrict: '区域',// 地图的筛选标题
      bounDaryData: {}, // 区域边界覆盖物
      popTop: '', // 弹窗的固定高度
      popContainer: '', // 弹窗的总高度
      popListHeight: '',
      lockLoading: false, // 显示“暂无房源”的锁
      borderRadius: '0.2rem',
    };
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["thisCityInfo", "switchCityInfo"]), //城市的信息
    ...mapState("map", ["searchMapHouseData", "drawIdArr"]), //城市的信息
    districtClass () {//是否有选择区域里的条件
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setDistrict) || !this.$commonUtils.utilCore.empty(this.listGetData.setDistrictMetro)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setDistrictList) || !this.$commonUtils.utilCore.empty(this.listGetData.setDresslistMetro)) {
        return "choose-active"
      }
      return ""
    },
    priceTabClass () {//是否有选择价格里的条件
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setPriceTabFirst) || !this.$commonUtils.utilCore.empty(this.listGetData.setPriceTabSecond)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(this.listGetData.setPriceFirstVal[1])) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(this.listGetData.setPriceSecondVal[1])) {
        return "choose-active"
      }
      return ""
    },
    huxingClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setHuxing) && !this.$commonUtils.utilCore.empty(this.listGetData.setHuxing[0].id)) {
        return "choose-active"
      }
      return ""
    },
    areaClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setMoreArea)) {
        return "choose-active"
      }
      return ""
    },
    moreTitleClass () {//是否有选择更多里的条件
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setMorePropertyType)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.listGetData.setMoreRenovation)) {
        return "choose-active"
      }
      return ""
    },
    districtMap () {//是否有选择区域里的条件
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDistrict.id) || !this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictMetro.id)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictList) || !this.$commonUtils.utilCore.empty(this.mapGetData.setDresslistMetro)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setNearby)) {
        return "choose-active"
      }
      return ""
    },
    priceTabMap () {//是否有选择价格里的条件
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setPriceTabFirst) || !this.$commonUtils.utilCore.empty(this.mapGetData.setPriceTabSecond)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(this.mapGetData.setPriceFirstVal[1])) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(this.mapGetData.setPriceSecondVal[1])) {
        return "choose-active"
      }
      return ""
    },
    huxingMap () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setHuxing) && !this.$commonUtils.utilCore.empty(this.mapGetData.setHuxing[0].id)) {
        return "choose-active"
      }
      return ""
    },
    areaMap () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setMoreArea)) {
        return "choose-active"
      }
      return ""
    },
    moreTitleMap () {//是否有选择更多里的条件
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setMorePropertyType)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setMoreRenovation)) {
        return "choose-active"
      }
      return ""
    },
    // 计算是否画圈了
    countIsDraw () {
      if (this.$commonUtils.utilCore.empty(this.polygonAfterDraw)) {
        return true
      } else {
        return false
      }
    },
    // 是否显示套数
    isShowNumHouse () {
      // 当没有地铁路线时
      if (!this.isOpenMetro) {
        if (!this.isShowDraw) return true
      } else {
        if (this.newMap.getZoom() > 16) {
          return true
        } else {
          return false
        }
      }
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.pageFrom = from.name;
    });
  },
  async activated () {
    const toggleArray = ["districtMap", "priceTabMap", "huxingMap", "areaMap", "moreTitleMap"];
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
    await this.getMapConfigInit()
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.getLongLat()
    //   this.initPage()
    // })
  },
  watch: {
    // 监听楼盘弹窗
    showHouse (newVal, oldVal) {
      if (newVal) {
        // 隐藏导航栏
        this.isNav = false
        this.$nextTick(() => {
          // 弹窗头部的高度
          this.popTop = this.$refs.popHeader.offsetHeight
          // 整个弹窗的高度
          this.popContainer = this.$refs.popRef.$el.offsetHeight
          this.popListHeight = this.popContainer - this.popTop
        })
      } else {
        this.isNav = true
      }
    },
  },
  methods: {
    // 抽离函数
    ...mapJS,
    // 初始化地图
    async getMapConfigInit () {
      if (this.pageFrom == 'maphouse-mapsearch') {
        // 如果是搜索
        if (!this.$commonUtils.utilCore.empty(this.searchMapHouseData)) {
          this.newMap.clearOverlays()
          this.resetFunciton('map', 'mapTab', false)
          this.optionsIndex = this.searchMapHouseData.typeIndex == '1' ? '0' : this.searchMapHouseData.typeIndex == '2' ? '1' : '2'
          if (this.optionsIndex == 1) {
            this.searchValue = this.searchMapHouseData.loupan_name
          } else {
            this.searchValue = this.searchMapHouseData.uptown_name
          }
          // 延迟跳转视角
          setTimeout(() => {
            this.newMap.setZoom(18);
            this.newMap.panTo(new BMap.Point(this.searchMapHouseData.longitude, this.searchMapHouseData.latitude));
          }, 500);
          // this.initMap(this.searchMapHouseData, 18)
          setTimeout(() => {
            this.mapGetData.zoom = 18
            this.getMapData(this.newMap)
            //区分是否搜索的同一个房源
            if (!this.$commonUtils.utilCore.empty(this.cloneSearchData)) {
              // 如果是同一套和同类型的就不展开下拉框
              if (this.cloneSearchData.uptown_id == this.searchMapHouseData.uptown_id && this.cloneSearchData.typeIndex == this.searchMapHouseData.typeIndex) {
                this.showHouse = false
                return
              } else {
                // 重置搜索条件
                this.initPage()
              }
            }
            this.showHouse = true
            // 克隆vuex数据 区分是否搜索的同一个房源
            this.cloneSearchData = this.$commonUtils.utilCore.deepClone(this.searchMapHouseData)
            // 获取小区详情和二手房列表
            this.getUptownAndSecondHouse(this.searchMapHouseData)
          }, 1000);
        } else {
          this.searchValue = '' // 清空搜索关键词
          setTimeout(() => {
            this.getMapData(this.newMap)
          }, 200);
        }
      } else if (this.pageFrom == 'common-index') {
        // keepalive需要初始化的值
        this.diskSourceType = [];//标签列表
        this.priceTabFirst = [];//价格区间列表（新房二手房）
        this.priceTabSecond = [];//单价列表(新房)
        this.huxing = [];//户型
        this.moreArea = [];//建筑面积列表
        this.morePropertyType = [];//物业类型
        this.moreRenovation = [];//装修情况
        // 区域
        this.district = [];
        //区域地址
        this.addresslist = [];
        // 地铁区域(线路)
        this.districtMetro = [];
        //地铁区域地址(站点)
        this.addresslistMetro = [];
        this.cloneSearchData = {}
        this.clickLabel = []
        this.clickLabelId = []
        this.clickUptownId = ''
        this.cloneObject = {} //深拷贝筛选点击确定后的数据
        this.mapGetData = { //搜索选择的条件
          bounds_max_lng: "",//	新增 否	string	最大经度
          bounds_min_lng: "",//	新增 否	string	最小经度
          bounds_max_lat: "",//新增 否	string	最大纬度
          bounds_min_lat: "",//新增 否	string	最小纬度
          zoom: "11",//新增 否	string	地图缩放比例
          longitude: "",//	新增 否	string	经度(定位)
          latitude: "",// 新增 否	string	纬度(定位)
          tabAreaIndex: 0,//区域tab切换 
          moreTitle: 0, // “更多”导航的标题选项
          tabPriceIndex: 0, // 价格tab切换
          setDiskIndex: [],//当前选择的标签
          setDistrict: {},//区域，
          setNearby: {}, // 区域-附近
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
          setSelected: [],// 已选中的
          houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
          searchKeyWord: "",//搜索关键字
          city_id: 8,//	否	string	城市id 默认8
          searchUptownId: '', // 小区id
          loading: false,//列表数据加载中
          finished: false,//列表数据已经加载完毕
        }
        this.listGetData = {
          tabAreaIndex: 0,//区域tab切换 
          moreTitle: 0, // “更多”导航的标题选项
          tabPriceIndex: 0, // 价格tab切换
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
          houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
          searchKeyWord: "",//搜索关键字
          inputKeyWord: "",//
          city_id: 8,//	否	string	城市id 默认8
          page: 0,//	否	string	页码 默认1
          page_size: 10,//	否	string	每页显示数 默认10
          searchUptownId: '', // 小区id
          loading: false,//列表数据加载中
          finished: false,//列表数据已经加载完毕
        }
        // 从首页进的
        this.showHouse = false
        this.isOpenMetro = false // 是否开启了线路图
        this.isShowmore = false
        this.searchValue = ''
        this.titleDistrict = '区域'
        if (!this.$commonUtils.utilCore.empty(this.searchMapHouseData)) {
          // 重置vuex数据
          this.$store.commit('map/setSearchMapHouseData', {});
        }
        this.initPage()
        this.isClosed = false;
        this.handleDropdownClone(1); //初始化深拷贝
        this.$nextTick(() => {
          this.getLongLat()
        })
      }
    },
    // 地图的函数
    initMap (info, zoom = 11) {
      //创建地图实例
      // let mapRef = this.$refs.container
      var map = new BMap.Map("container");  // 创建地图实例 
      var point = new BMap.Point(info.longitude, info.latitude);  // 创建点坐标
      this.newMap = map
      map.setMaxZoom(19)
      map.setMinZoom(7)
      // 初始化地图，设置中心点坐标和地图级别
      map.centerAndZoom(point, zoom);
      // 开启鼠标滚轮缩放
      map.enableScrollWheelZoom(true);
      map.enableContinuousZoom(); //开启启用连续缩放效果
      map.disableInertialDragging(); //禁用地图惯性拖拽
      // map.disableDragging();
      // 获取接口数据
      this.getMapData(map)
      //开启监听事件
      this.bindEvents(this.newMap)
    },
    // 获取经纬度
    async getLongLat () {
      let postData = {
        site_name: this.switchCityInfo.city_name || '广州',
      }
      let res = await this.$store.dispatch('city/getAppFangBaseDataGetCityRows', { postData: postData });
      if (res) {
        this.cityInfo = res.city_info
        this.initMap(res.city_info)
      }
    },
    async getMapData (map) {
      this.dataList = {}
      // map.clearOverlays();
      let bounds = map.getBounds(); // 获取屏幕四个角的经纬度]
      let southllest = bounds.getSouthWest(); // 获取西南角的经纬度(左下角)
      let northEast = bounds.getNorthEast(); // 获取东北角的经纬度(右上角)
      this.mapGetData.bounds_max_lng = northEast.lng
      this.mapGetData.bounds_max_lat = northEast.lat
      this.mapGetData.bounds_min_lng = southllest.lng
      this.mapGetData.bounds_min_lat = southllest.lat
      let res = await this.$store.dispatch(`map/${this.optionsIndex == 0 ? "actAppFangMapaBubbleSale" : this.optionsIndex == 1 ? "actAppFangMapaBubbleHouse" : "actAppFangMapaBubbleRent"}`, this.mapGetData);
      if (res) {
        this.dataList = res
        this.getLabel(map) // 获取label
      }
    },
    //绑定按钮事件
    bindEvents (map) {
      //为地图绑定鼠标按下事件(开始画圈) 当手指触摸屏幕的时候触发
      map.addEventListener('touchstart', (e) => {
        //如果处于画圈状态下,清空上次画圈的数据结构,设置isMouseDown进入画圈鼠标按下状态
        if (this.isInDrawing) {
          //清空地图上画的折线和圈
          map.removeOverlay(this.polygonAfterDraw);
          map.removeOverlay(this.lastPolyLine);
          this.polyPointArray = [];
          this.lastPolyLine = null;
          this.isMouseDown = true;
        }
      });
      //为地图绑定鼠标抬起事件(画圈完成) 当手指离开屏幕的时候触发
      map.addEventListener('touchend', (e) => {
        if (!this.$commonUtils.utilCore.empty(this.polygonAfterDraw)) {
          // 判断画圈后点击小区弹窗，点其他区域关闭弹窗
          if (e.domEvent.target.localName == 'canvas' && this.dataList.bubble_type == 'uptown') {
            this.showHouse = false
            // console.log('画图时你点击了', e)
          }
          return
        }
        //如果处于画圈状态下 且 鼠标是按下状态
        if (this.isInDrawing && this.isMouseDown) {
          //退出画线状态
          this.isMouseDown = false;
          //添加多边形覆盖物,设置为禁止点击
          var polygon = new BMap.Polygon(this.polyPointArray, {
            strokeColor: '#FE6E0A',
            strokeOpacity: 1,
            fillColor: '#FFE47A',
            fillOpacity: 0.3,
            enableClicking: false
          });
          polygon.disableMassClear()
          map.addOverlay(polygon);

          //保存多边形,用于后续删除该多边形
          this.polygonAfterDraw = polygon
          if (map.getZoom() == 14 || map.getZoom() == 15 || map.getZoom() == 16) {
            this.getSoundLngLat(this.polygonAfterDraw.getBounds(), map)
          } else {
            //计算房屋对于多边形的包含情况
            this.caculateEstateContainedInPolygon(this.polygonAfterDraw, map);
          }
          // 画完后可移动屏幕了
          map.enableDragging();
        } else {
          // 解决touchend事件与点击事件冲突问题
          if (this.isMove) {
            console.log('你移动了')
            setTimeout(() => {
              var zoom = map.getZoom()
              if (this.isOpenMetro) {
                if (zoom >= 11 && zoom <= 13) {
                  if (!this.$commonUtils.utilCore.empty(this.markerList)) {
                    this.markerList.forEach(item => {
                      map.removeOverlay(item)
                    })
                  }
                  if (!this.$commonUtils.utilCore.empty(this.blockList)) {
                    this.blockList.forEach(item => {
                      item.hide()
                    })
                  }
                } else if (zoom == 14 || zoom == 15 || zoom == 16) {
                  if (!this.$commonUtils.utilCore.empty(this.markerList)) {
                    this.markerList.forEach(item => {
                      map.removeOverlay(item)
                    })
                    this.markerList = []
                  }
                  if (!this.$commonUtils.utilCore.empty(this.metroList)) {
                    this.metroList.forEach(item => {
                      // map.removeOverlay(item)
                      item.hide()
                    })
                    // this.metroList = []
                  }
                  // 有bug
                  // if (!this.$commonUtils.utilCore.empty(this.cirCleList)) {
                  //   this.cirCleList.forEach(item => {
                  //     // map.removeOverlay(item)
                  //     // item.hide()
                  //     item.setFillColor('transparent')
                  //     item.setStrokeColor('transparent')
                  //   })
                  // }
                  this.getMetroLabel(map)
                } else if (zoom > 16 && zoom <= 19) {
                  // if (!this.$commonUtils.utilCore.empty(this.cirCleList)) {
                  //   this.cirCleList.forEach(item => {
                  //     // map.removeOverlay(item)
                  //     // item.hide()
                  //     item.setFillColor('#FFE47A')
                  //     item.setStrokeColor('#F45C45')
                  //   })
                  // }
                  if (!this.$commonUtils.utilCore.empty(this.blockList)) {
                    this.blockList.forEach(item => {
                      item.hide()
                    })
                  }
                  if (!this.$commonUtils.utilCore.empty(this.metroList)) {
                    this.metroList.forEach(item => {
                      // map.removeOverlay(item)
                      item.show()
                    })
                    // this.metroList = []
                  }
                  this.mapGetData.zoom = 16
                  this.getMapData(map)
                }
                return
              }
              if (zoom >= 11 && zoom < 13) {
                if (this.optionsIndex == 1) {
                  if (zoom == 11) {
                    this.mapGetData.zoom = 11
                  } else if (zoom > 11) {
                    this.mapGetData.zoom = zoom
                  }
                } else {
                  this.mapGetData.zoom = 11
                }
                this.getMapData(map)
              } else if (zoom == 13 || zoom == 14 || zoom == 15 || zoom == 16) {
                if (this.showHouse) {
                  this.showHouse = false
                }
                this.mapGetData.zoom = 14
                this.getMapData(map)
              } else if (zoom > 16 && zoom <= 19) {
                this.mapGetData.zoom = 16
                this.getMapData(map)
              }
            }, 200);
          } else {
            console.log('你点击了', e)
            if (!this.$commonUtils.utilCore.empty(e.cb)) {
              return
            }
            // 点击除了小区以外的区域关闭弹窗
            if (this.dataList.bubble_type == 'uptown') {
              if (e.domEvent.target.className == 'BMap_mask' || e.target.Ae.className == 'BMap_mask') {
                this.showHouse = false
                if (!this.$commonUtils.utilCore.empty(this.clickLabelId)) {
                  this.markerList.forEach(item => {
                    this.clickLabelId.forEach(itemid => {
                      if (itemid == item.V.lastElementChild.dataset.id) {
                        item.V.lastElementChild.lastElementChild.setAttribute("style", "border-top:0.25rem solid #FFC16C;")
                        item.setStyle({
                          background: '#FFC16C',
                          fontWeight: '400',
                        })
                      }
                    })
                  })
                }
              }
            }
          }
        }
        this.moveX = 0
        this.isMove = false

      });
      //为地图绑定鼠标移动事件(触发画图) 当手指在屏幕来回的滑动时候触发
      map.addEventListener('touchmove', (e) => {
        // 解决touchend事件与点击事件冲突问题
        this.moveX = e.touches[0].clientX
        if (this.moveX) {
          this.isMove = true
        }
        //如果处于鼠标按下状态,才能进行画操作
        if (this.isMouseDown) {
          //将鼠标移动过程中采集到的路径点加入数组保存
          this.polyPointArray.push(e.point);
          //除去上次的画线
          if (this.lastPolyLine) {
            map.removeOverlay(this.lastPolyLine)
          }
          //根据已有的路径数组构建画出的折线
          var polylineOverlay = new BMap.Polyline(this.polyPointArray, {
            strokeColor: '#FE6E0A',
            strokeOpacity: 1,
            enableClicking: false
          });
          //添加新的画线到地图上
          polylineOverlay.disableMassClear()
          map.addOverlay(polylineOverlay);
          //更新上次画线条
          this.lastPolyLine = polylineOverlay
        }
      })
      // map.addEventListener('zoomend', (e) => {

      // })
    },
    getLabel (map) {
      if (!this.$commonUtils.utilCore.empty(this.markerList)) {
        this.markerList.forEach(item => {
          map.removeOverlay(item)
        })
      }
      this.markerList = []
      // this.clickLabel = []
      this.$nextTick(() => {
        this.dataList.rows.forEach((item, index) => {
          var setLongitude = item.third_longitude ? item.third_longitude == 0 ? item.longitude : item.third_longitude : item.longitude
          var setLatitude = item.third_latitude ? item.third_latitude == 0 ? item.latitude : item.third_latitude : item.latitude
          var point = new BMap.Point(setLongitude, setLatitude)
          // 生成楼房所在坐标位置提示框
          var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(0, 0) //设置文本偏移量
          }
          //  默认地图
          if (this.dataList.bubble_type == 'uptown') {
            // 新房没套数 小区字段也不一样
            if (this.optionsIndex == 1) {
              var label = new BMap.Label(`<div class="label-house" data-id="${item.loupan_id}" data-num="${item.result_num}"><div>` + item.loupan_name + '&nbsp ' + '</div><div>' + this.setNumber(item.average_price, 'price', 'newhouse') + '</div><div>' + '(' + item.property_type_name + ')' + `</div><div class="triangle" triangle-id="${item.loupan_id}"></div></div>`, opts);
            }
            // 租房没有价格 
            else if (this.optionsIndex == 2) {
              var label = new BMap.Label(`<div class="label-house" data-id="${item.uptown_id}" data-num="${item.result_num}"><div>` + item.uptown_name + '&nbsp ' + '</div><div>' + this.setNumber(item.result_num, 'houseNum') + `</div><div class="triangle" triangle-id="${item.uptown_id}"></div></div>`, opts);
            } else {
              var label = new BMap.Label(`<div class="label-house" data-id="${item.uptown_id}" data-num="${item.result_num}"><div>` + item.uptown_name + '&nbsp ' + '</div><div>' + this.setNumber(item.average_price != 0 ? item.average_price : item.avg_price, 'price', 'uptown') + '&nbsp' + '(' + this.setNumber(item.result_num, 'houseNum') + ')' + `</div><div class="triangle" triangle-id="${item.uptown_id}"></div></div>`, opts);
            }

            if (!this.$commonUtils.utilCore.empty(this.clickLabelId)) {
              this.clickLabelId.forEach(itemId => {
                if (itemId == item.uptown_id) {
                  this.$nextTick(() => {
                    if (this.optionsIndex == 1) {
                      var triangleDom = document.querySelector('[triangle-id=' + '"' + item.loupan_id + '"' + ']');
                    } else {
                      var triangleDom = document.querySelector('[triangle-id=' + '"' + item.uptown_id + '"' + ']');
                    }
                    if (this.showHouse) {
                      if (this.clickUptownId == item.uptown_id) {
                        triangleDom.setAttribute("style", "border-top:0.25rem solid #F41809;")
                        label.setStyle({
                          borderRadius: '0.1rem',
                          background: '#F41809',
                          border: 'none',
                          cursor: "pointer",
                          fontWeight: 'bold',
                        })
                      } else {
                        triangleDom.setAttribute("style", "border-top:0.25rem solid #FFC16C;")
                        label.setStyle({
                          borderRadius: '0.1rem',
                          background: '#FFC16C',
                          border: 'none',
                          cursor: "pointer",
                          fontWeight: '400',
                        })
                      }
                    } else {
                      triangleDom.setAttribute("style", "border-top:0.25rem solid #FFC16C;")
                      label.setStyle({
                        borderRadius: '0.1rem',
                        background: '#FFC16C',
                        border: 'none',
                        cursor: "pointer",
                        fontWeight: '400',
                      })
                    }


                  })
                } else {
                  label.setStyle({
                    borderRadius: '0.1rem',
                    background: '#FE970A',
                    border: 'none',
                    cursor: "pointer",
                  })
                }
              })
            } else {
              label.setStyle({
                borderRadius: '0.1rem',
                background: '#FE970A',
                border: 'none',
                cursor: "pointer",
              })
            }
            // 如果是搜索页进来的
            if (this.pageFrom == 'maphouse-mapsearch' && !this.$commonUtils.utilCore.empty(this.searchMapHouseData)) {
              if (this.optionsIndex == 1) {
                // 新房的
                if (this.searchMapHouseData.loupan_id == item.loupan_id) {
                  label.setStyle({
                    background: '#F41809',
                    fontWeight: 'bold',
                  })
                  this.$nextTick(() => {
                    var triangleDom = document.querySelector('[triangle-id=' + '"' + item.loupan_id + '"' + ']');
                    triangleDom.setAttribute("style", "border-top:0.25rem solid #F41809;")
                  })
                  // 在售（租）多少套
                  this.sellRentNum = item.result_num
                  this.clickLabel.push(label)
                  this.clickLabelId.push(item.uptown_id)
                  this.clickUptownId = item.uptown_id
                  //页面来源置空
                  this.pageFrom = ''
                }
              } else {
                if (this.searchMapHouseData.uptown_id == item.uptown_id) {
                  label.setStyle({
                    background: '#F41809',
                    fontWeight: 'bold',
                  })
                  this.$nextTick(() => {
                    var triangleDom = document.querySelector('[triangle-id=' + '"' + item.uptown_id + '"' + ']');
                    triangleDom.setAttribute("style", "border-top:0.25rem solid #F41809;")
                  })

                  // 在售（租）多少套
                  this.sellRentNum = item.result_num
                  this.clickLabel.push(label)
                  this.clickLabelId.push(item.uptown_id)
                  this.clickUptownId = item.uptown_id
                  //页面来源置空
                  this.pageFrom = ''
                }
              }
            }
          } else {
            var label = new BMap.Label('<div class="label-circular"><div>' + item.area_name + '</div><div>' + this.setNumber(item.result_num, 'houseNum') + '</div></div>', opts);
            label.setStyle({
              borderRadius: '50%',
              background: '#fe970a',
              border: 'none',
              cursor: "pointer",
              boxShadow: '0rem 0rem 0.04rem 0rem rgba(0, 0, 0, 0.3)'
            })
          }
          label.setZIndex(1000)
          // marker.setLabel(label);
          this.markerList.push(label)
          //label点击事件
          label.addEventListener("click", (e) => { //点击label隐藏label
            if (this.dataList.bubble_type == 'district') {
              // 找出符合条件的区域的参数
              this.handleDropdownClone(1) // 要先拷贝一下
              this.mapGetData.tabAreaIndex = 0
              let result = this.district.find(itemDistrict => {
                return itemDistrict.name == item.area_name
              })
              this.chooseDistrict(result, 'mapTab', true)
              setTimeout(() => {
                this.closeDropdownMenu('districtMap', false, 'mapTab')
              }, 200);
              let setLongitude = item.third_longitude ? item.third_longitude == 0 ? item.longitude : item.third_longitude : item.longitude
              let setLatitude = item.third_latitude ? item.third_latitude == 0 ? item.latitude : item.third_latitude : item.latitude
              var point = new BMap.Point(setLongitude, setLatitude);  // 创建点坐标
              // if (this.optionsIndex == 1) {
              //   this.mapGetData.zoom = 12
              //   map.setZoom(12);
              //   map.panTo(point);
              //   // map.centerAndZoom(point, 12);
              // } else {
              //   this.mapGetData.zoom = 14
              //   map.setZoom(14);
              //   map.panTo(point);
              //   // map.centerAndZoom(point, 14);
              // }
            } else if (this.dataList.bubble_type == 'block') {
              let result = this.addresslist.find(itemAddresslist => {
                return itemAddresslist.name == item.area_name
              })
              if (!this.$commonUtils.utilCore.empty(result)) {
                // 先清掉已选的
                for (var i = 0; i < this.mapGetData.setSelected.length; i++) {
                  if (this.mapGetData.setSelected[i].tabAreaIndex == 0 && this.mapGetData.setSelected[i].type == 'district') {
                    this.mapGetData.setSelected.splice(i--, 1);
                  }
                }
                this.mapGetData.setDistrictList = []
                this.chooseDistrictAddress(result, 'district', true, false, 'mapTab')
                setTimeout(() => {
                  this.closeDropdownMenu('districtMap', false, 'mapTab')
                }, 200);
              } else {
                // 如果点到已选的区域以外的其他街道
                let parentResult = this.district.find(itemDistrict => {
                  return itemDistrict.id == item.parent_id
                })
                this.chooseDistrict(parentResult, 'mapTab', true)
                setTimeout(() => {
                  let result = this.addresslist.find(itemAddresslist => {
                    return itemAddresslist.name == item.area_name
                  })
                  this.chooseDistrictAddress(result, 'district', true, false, 'mapTab')
                  this.closeDropdownMenu('districtMap', false, 'mapTab')
                }, 200);
                console.log('选到其他区啦', parentResult);
              }
              // let setLongitude = item.third_longitude ? item.third_longitude == 0 ? item.longitude : item.third_longitude : item.longitude
              // let setLatitude = item.third_latitude ? item.third_latitude == 0 ? item.latitude : item.third_latitude : item.latitude


            } else if (this.dataList.bubble_type == 'uptown') {
              if (this.showHouse) {
                if (this.clickUptownId == item.uptown_id) {
                  return
                }
              }
              this.clickLabelId.push(label.V.lastElementChild.dataset.id)
              this.clickUptownId = label.V.lastElementChild.dataset.id
              this.clickLabel.push(label)
              this.clickLabel.forEach(itemLabel => {
                if (itemLabel == label) {
                  if (this.optionsIndex == 1) {
                    var triangleDom = document.querySelector('[triangle-id=' + '"' + item.loupan_id + '"' + ']');
                  } else {
                    var triangleDom = document.querySelector('[triangle-id=' + '"' + item.uptown_id + '"' + ']');
                  }
                  triangleDom.setAttribute("style", "border-top:0.25rem solid #F41809;")
                  label.setStyle({
                    background: '#F41809',
                    fontWeight: 'bold',
                  })
                } else {
                  if (!this.$commonUtils.utilCore.empty(itemLabel.V)) {
                    itemLabel.V.lastElementChild.lastElementChild.setAttribute("style", "border-top:0.25rem solid #FFC16C;")
                    itemLabel.setStyle({
                      background: '#FFC16C',
                      fontWeight: '400',
                    })
                  }
                }
              })
              if (this.clickLabelId.length > 1) {
                let markerlabel = this.markerList.find(itemMarker => {
                  return this.clickLabelId[this.clickLabelId.length - 2] == itemMarker.V.lastElementChild.dataset.id
                })
                if (!this.$commonUtils.utilCore.empty(markerlabel)) {
                  markerlabel.V.lastElementChild.lastElementChild.setAttribute("style", "border-top:0.25rem solid #FFC16C;")
                  markerlabel.setStyle({
                    background: '#FFC16C',
                    fontWeight: '400',
                  })
                }
              }

              // 在售（租）多少套
              this.sellRentNum = item.result_num
              this.showHouse = true
              // 每次点击小区重置筛选列表
              this.resetFunciton('map', 'listTab')
              const { setPriceTabFirst, setPriceFirstVal, setHuxing, setMoreArea, setMorePropertyType, setMoreRenovation } = this.mapGetData
              this.listGetData.setPriceTabFirst = JSON.parse(JSON.stringify(setPriceTabFirst))
              this.listGetData.setPriceFirstVal = JSON.parse(JSON.stringify(setPriceFirstVal))
              this.listGetData.setHuxing = JSON.parse(JSON.stringify(setHuxing))
              this.listGetData.setMoreArea = JSON.parse(JSON.stringify(setMoreArea))
              this.listGetData.setMorePropertyType = JSON.parse(JSON.stringify(setMorePropertyType))
              this.listGetData.setMoreRenovation = JSON.parse(JSON.stringify(setMoreRenovation))

              const toggleArray = ["priceTab", "huxing", "area", "moreTitle"];
              setTimeout(() => {
                for (let i = 0; i < toggleArray.length; i++) {
                  const itemCol = toggleArray[i];
                  if (this.$refs[itemCol]) {
                    this.$refs[itemCol].toggle(false);
                  }
                }
              }, 100);
              this.handleDropdownClone()
              this.lockLoading = false
              // 获取小区详情和二手房列表
              this.getUptownAndSecondHouse(item)
            }
          });
          map.addOverlay(label)
        })
        // 当在街道的高度画圈时执行
        if (!this.$commonUtils.utilCore.empty(this.polygonAfterDraw)) {
          this.hideMarker(map);
          this.caculateEstateContainedInPolygon(this.polygonAfterDraw, map)
        }
      })
    },
    changeHeight () {
      if (this.optionsIndex != 1) {
        if (this.popHeight == '50') {
          this.openAniRise = true
          this.popHeight = 100
          setTimeout(() => {
            this.openAniRise = false
            // 异步获取高度
            this.computedHeight()
          }, 500);
        } else {
          this.openAniDescend = true
          this.popHeight = 50
          setTimeout(() => {
            this.openAniDescend = false
          }, 500);
        }
      } else {
        this.showHouse = false
      }
      this.$nextTick(() => {
        console.log('看看高度', this.$refs.popRef.$el.style.height);
      })
    },
    // 设置房源套数
    setNumber (num, type = 'houseNum', housetype = 'normal') {
      let value = Number(num)
      // 计算价格还是套数
      if (type == 'price') {
        if (housetype == 'newhouse') {
          return Number(num) + '元/平'
        }
        return Number((value / 10000).toFixed(1)) + '万'
      } else {
        if (value >= 10000) {
          return Number((value / 10000).toFixed(1)) + '万'
        } else {
          return value + '套'
        }
      }
    },
    countAvagePrice (num) {
      return Math.round(num)
    },
    // 定位
    geoCoder (type = false, id) {
      let geolocation = new BMap.Geolocation()
      var _this = this
      geolocation.getCurrentPosition(function (r) {
        var point = new BMap.Point(r.longitude, r.latitude)
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          if (type) {
            _this.mapGetData.longitude = r.longitude
            _this.mapGetData.latitude = r.latitude
            // id == 1 ? 17 : id == 2 ? 16 : 15
            _this.newMap.setZoom(17)
            _this.newMap.panTo(point)
            var cirCle = new BMap.Circle(point, id == 1 ? 1000 : id == 2 ? 2000 : 3000, {
              strokeColor: '#FE6E0A',
              strokeOpacity: 1,
              fillColor: '#FFE47A',
              fillOpacity: 0.3,
              enableClicking: false
            })
            _this.oldCircle = cirCle
            _this.newMap.addOverlay(cirCle)
            _this.mapGetData.zoom = 16
            _this.getMapData(_this.newMap);
            return
          }
          var marker = new BMap.Marker(point);
          // marker.disableMassClear()
          _this.newMap.setZoom(17)
          _this.newMap.panTo(point)
          _this.mapGetData.zoom = 16
          _this.getMapData(_this.newMap);
          _this.newMap.addOverlay(marker)
        }
        else {
          alert('failed' + this.getStatus());
        }
      }, { enableHighAccuracy: true })
    },
    // 切换房源类型
    changeOptions (item) {
      if (item.id == this.optionsIndex) {
        return;
      }
      this.newMap.clearOverlays()
      this.optionsIndex = item.id
      this.searchValue = ''
      this.titleDistrict = '区域'
      this.clickLabel = []
      this.clickLabelId = []
      this.clickUptownId = ''
      // 重新执行筛选列表
      this.initPage()
      this.resetFunciton('map', 'mapTab', true)
      // this.getMapData(this.newMap)
      // var point = new BMap.Point(this.cityInfo.longitude, this.cityInfo.latitude);  // 创建点坐标
      // this.newMap.centerAndZoom(point, 11)
    },
    // 弹窗上拉固定定位导航动态高度
    computedHeight () {
      const navheight = document.querySelector(".fixed-container")
      this.navheight = navheight.offsetHeight
    },
    onClickLeft () {
      this.toolsGoPageView({
        path: '/common/index'
      })
      // 清楚地图搜索参数
      this.$store.commit('map/setSearchMapHouseData', {});
      // this.$router.go(-1);//返回上一层
    },
  },
}
</script>

<style lang="scss" scoped>
// 下拉菜单最大高度 UI图 7.34 + 1.32
$dropdownContent: 8.66rem;
// 下拉菜单确认按钮浮动起来  按钮高度 + padding-bottom 1rem
$dropdownBottomBtn: 1.64rem + 1rem;
.mapselection {
  .wrapper {
    position: relative;
    .nav-container {
      width: 6.92rem;
      height: 2.62rem;
      background: #ffffff;
      position: absolute;
      z-index: 999;
      left: 0;
      top: 1rem;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      border-radius: 0.2rem;
      z-index: 999;
      .nav-top {
        padding: 0.44rem 0 0.3rem 0.42rem;
        display: flex;
        align-items: center;
        .nav-top-left {
          padding-right: 1.3rem;
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
          }
        }
        .nav-top-right {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          display: flex;
          align-items: center;
          .options-item {
            padding-right: 0.5rem;
            position: relative;
            img {
              width: 0.52rem;
              height: 0.16rem;
              display: block;
              position: absolute;
              bottom: -0.05rem;
              left: 0.1rem;
            }
          }
        }
      }
      .nav-middle {
      }
      /deep/ .van-dropdown-item__content {
        width: 6.92rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        border-radius: 0 0 0.2rem 0.2rem;
        max-height: 90%;
      }
    }
    .map-container {
      width: 100%;
      height: 100vh;
    }
    .btn-draw {
      width: 3.66rem;
      height: 1.3rem;
      background: #ffffff;
      position: absolute;
      z-index: 999;
      left: 50%;
      top: 2rem;
      // margin: 0 auto;
      transform: translateX(-50%);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .draw-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 0.36rem;
          height: 0.36rem;
          margin-bottom: 0.1rem;
        }
        span {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
        }
      }
    }
    .fun-box {
      width: 0.84rem;
      // height: 3rem;
      background: #ffffff;
      box-shadow: 0rem 0rem 0.04rem 0rem rgba(0, 0, 0, 0.2);
      position: absolute;
      bottom: 1.2rem;
      right: 0.3rem;
      z-index: 998;
      border-radius: 0.1rem;
      .fun-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 0.15rem 0;
        img {
          width: 0.32rem;
          height: 0.32rem;
          display: block;
        }
        .btn-name {
          font-size: 0.22rem;
          font-weight: 400;
          color: #111111;
          padding-top: 0.1rem;
        }
      }
      .fun-line {
        width: 0.43rem;
        height: 0.04rem;
        background-color: #f0f0f0;
        margin-top: 0.15rem;
      }
      .fun-draw-tips {
        width: 4rem;
        height: 0.66rem;
        font-size: 0.3rem;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        line-height: 0.66rem;
        background: #373737;
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        border-radius: 0.05rem;
        &::after {
          content: "";
          // display: block;
          border-top: 0.13rem solid transparent;
          border-right: 0.25rem solid transparent;
          border-bottom: 0.13rem solid transparent;
          border-left: 0.25rem solid #373737;
          position: absolute;
          right: -0.5rem;
          top: 30%;
        }
      }
    }
    .number-house {
      // width: 4.06rem;
      height: 0.78rem;
      background: #ffffff;
      font-size: 0.3rem;
      font-weight: bold;
      color: #000000;
      text-align: center;
      line-height: 0.78rem;
      position: absolute;
      bottom: 1.2rem;
      left: 50%;
      z-index: 998;
      transform: translateX(-50%);
      border-radius: 1rem;
      padding: 0 0.24rem 0 0.22rem;
      white-space: nowrap;
      display: flex;
      align-items: center;
      span {
        color: #fe970a;
      }
      img {
        width: 0.2rem;
        height: 0.2rem;
        display: block;
        margin-left: 0.1rem;
      }
    }
  }
  .nav-bottom {
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
          background: #f8f8f8;
          ul {
            li {
              width: 2.52rem;
              height: 0.8rem;
              font-size: 0.28rem;
              font-weight: 400;
              text-indent: 0.4rem;
              line-height: 0.8rem;
              color: #000000;
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
              border-bottom: 0.02rem solid #f7f7f7;
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
        .region-nearby {
          background: #f8f8f8;
          // width: 100%;
          .nearby-item {
            width: 5.2rem;
            height: 0.8rem;
            // line-height: 0.8rem;
            padding: 0 0.66rem 0 0.4rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            color: #000000;
            .nearby-item-left {
              font-size: 0.28rem;
              font-weight: 400;
            }
            .nearby-item-right {
              img {
                width: 0.3rem;
                height: 0.3rem;
                display: block;
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
    }
    .house-type {
      .type-title {
        font-size: 0.3rem;
        font-weight: 400;
        color: #111111;
        padding: 0.3rem 0 0 0.36rem;
      }
      .type-content {
        padding: 0.4rem 0.36rem;
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
          width: 1.4rem;
          height: 0.64rem;
          font-size: 0.25rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 0.64rem;
          background: #f5f5f5;
          border-radius: 0.04rem;
          margin-bottom: 0.28rem;
          margin-right: 0.2rem;
          white-space: nowrap;
          &:nth-child(4n) {
            margin-right: 0;
          }
        }
        .type-map-price {
          height: 0.64rem;
          line-height: 0.64rem;
          font-size: 0.25rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          background: #f5f5f5;
          border-radius: 0.04rem;
          margin-bottom: 0.28rem;
          margin-right: 0.2rem;
          white-space: nowrap;
          padding: 0 0.1rem;
        }
      }
    }
    .house-postbox {
      .price-ipt {
        padding: 0.5rem 0.36rem 0.1rem;
      }
      .more-item {
        // width: 1.4rem;
        margin-right: 0.2rem !important;
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
          margin-right: 0.3rem;
          ul {
            li {
              width: 1.72rem;
              height: 1rem;
              text-align: center;
              line-height: 1rem;
              color: #000000;
              background: #fafafa;
            }
          }
        }
        .more-right {
          padding-top: 0.3rem;
          .more-right-title {
            font-size: 0.32rem;
            font-weight: 400;
            color: #000000;
            padding-bottom: 0.28rem;
          }
          .more-item-content {
            display: flex;
            flex-wrap: wrap;
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
          white-space: nowrap;
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
  }
  .map-nav-bottom {
    /deep/ .van-dropdown-menu {
      .van-dropdown-menu__bar {
        border-radius: var(--borderRadius);
      }
    }
  }
  .pop-container {
    // position: relative;
    transform: translate(0, 0);
    .pop-header {
      width: 100%;
      position: fixed;
      top: 0;
      right: 0;
      .pop-arrow-top {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 0.12rem;
        img {
          width: 0.8rem;
          height: 0.15rem;
        }
      }
      .pop-info {
        // position: fixed;
        // top: 0;
        // right: 0;
        padding: 0.28rem 0 0.28rem 0.42rem;
        border-bottom: 0.02rem solid #f7f7f7;
        .info-name {
          font-size: 0.34rem;
          font-weight: 400;
          color: #000000;
          display: flex;
          align-items: center;
          img {
            width: 0.3rem;
            height: 0.34rem;
            display: block;
            margin-left: 0.1rem;
          }
        }
        .info-lable {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          display: flex;
          align-items: flex-start;
          padding-top: 0.2rem;
          .label-address {
            padding-right: 0.2rem;
            display: flex;
            align-items: center;
            .address {
              display: flex;
              align-items: center;
              &::after {
                content: "";
                width: 0.02rem;
                height: 0.28rem;
                display: block;
                background-color: #000000;
                margin: 0 0.1rem;
              }
            }
          }
          .label-price {
            span {
              color: #f41809;
            }
          }
        }
      }
    }
    .pop-nothing {
      font-size: 0.3rem;
      font-weight: 400;
      color: #737373;
      text-align: center;
      padding-top: 1rem;
    }
    .pop-house {
      overflow: auto;
    }
  }
  .pop-screen-container {
    .fixed-container {
      width: 100%;
      position: fixed;
      top: 0;
      background-color: #fff;
      z-index: 99;
      .screen-top {
        border-bottom: 0.02rem solid #f8f8f8;
      }
    }
    .icon-return {
      img {
        width: 0.25rem;
        height: 0.25rem;
        display: block;
      }
    }
    .screen-source-type {
      padding: 0.26rem 0.1rem 0.26rem 0.3rem;
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      .disk-item {
        font-size: 0.22rem;
        font-weight: 400;
        color: #000000;
        background: #f8f8f8;
        border-radius: 0.4rem;
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
      max-height: 1.75rem;
      box-sizing: border-box;
      display: flex;
      align-items: baseline;
      padding: 0.14rem 0.2rem 0rem 0.36rem;
      overflow: hidden;
      border-bottom: 0.04rem solid #f8f8f8;
      .selected-title {
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        white-space: nowrap;
      }
      .selected-content {
        width: 4.5rem;
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
          margin-right: 0.46rem;
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
        bottom: 0.34rem;
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
    .selected-moreTitle {
      max-height: 2rem;
      padding: 0.4rem 0.2rem 0.18rem 0.34rem;
    }
    .fixed-line {
      width: 100%;
      height: 0.1rem;
      background: #f0f0f0;
    }
  }
  .bg-img {
    position: absolute;
    z-index: 99;
    pointer-events: none;
    img {
      width: 100%;
      height: 100vh;
    }
  }
  .disk-active {
    border: 0.02rem solid #ffce09 !important;
    background: #fef6d6 !important;
  }
  .options-active {
    font-size: 0.36rem !important;
    font-weight: bold !important;
  }
  .more-active {
    font-weight: bold;
    color: #f7d447 !important;
    background: #ffffff !important;
  }
  .region-active {
    font-weight: bold;
    background: #ffffff !important;
  }
  .choose-active {
    font-weight: 500;
    color: #000000;
  }
  .type-active {
    width: 1.35rem !important;
    height: 0.6rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .type-map-price-active {
    height: 0.6rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .type-active-price {
    background: #fef6d6;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .type-more-active {
    width: 1.35rem !important;
    height: 0.6rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  /deep/ .more-active {
    font-weight: bold;
    color: #f7d447 !important;
    background: #ffffff !important;
  }
  /deep/ .choose-active {
    font-weight: 500;
    color: #efac08 !important;
    background: #ffffff !important;
    &::after {
      border-color: transparent transparent #efac08 #efac08;
    }
  }
  // /deep/ .van-dropdown-item__content {
  //   width: 6.92rem;
  //   left: 0;
  //   right: 0;
  //   margin: 0 auto;
  //   border-radius: 0 0 0.2rem 0.2rem;
  // }
  /deep/ .label-circular {
    width: 1.12rem;
    height: 1.12rem;
    font-weight: bold;
    color: #ffffff;
    // box-shadow: 0rem 0rem 0.04rem 0rem rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: normal;
    text-align: center;
    flex-wrap: wrap;
    border: none;
    border-radius: 50%;
  }
  /deep/ .label-metro {
    font-size: 0.24rem;
    font-weight: 400;
    color: #ffffff;
    padding: 0.1rem 0.16rem;
    display: flex;
    align-items: center;
    background: #f41809;
    border-radius: 50%;
    box-sizing: border-box;
    img {
      width: 0.3rem;
      height: 0.35rem;
      display: block;
      margin-right: 0.1rem;
    }
  }
  /deep/ .label-house {
    font-size: 0.24rem;
    font-weight: 400;
    color: #ffffff;
    padding: 0.1rem 0.2rem;
    display: flex;
    align-items: center;
    position: relative;
    .triangle {
      width: 0;
      height: 0;
      border: 0.25rem solid transparent;
      border-top: 0.25rem solid #fe970a;
      position: absolute;
      bottom: -0.4rem;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
  /deep/ .van-dropdown-menu {
    .van-dropdown-menu__bar {
      box-shadow: none;
      padding-right: 0.2rem;
      border-bottom: 0.02rem solid #f8f8f8;
    }
    .van-dropdown-item__option {
      text-align: center;
    }
  }
  // 弹窗遮罩层
  /deep/ .van-overlay {
    background-color: rgba(0, 0, 0, 0);
  }
  @keyframes popTransition_rise {
    0% {
      height: 50%;
    }

    100% {
      height: 70%;
    }

    100% {
      height: 100%;
    }
  }
  @keyframes popTransition_descend {
    0% {
      height: 100%;
    }

    100% {
      height: 70%;
    }

    100% {
      height: 50%;
    }
  }
  .pop-rise {
    animation-name: popTransition_rise;
    animation-duration: 0.5s;
  }
  .pop-descend {
    animation-name: popTransition_descend;
    animation-duration: 0.5s;
  }
  /deep/ ._search-box .search-btn {
    height: 0.55rem;
    top: 0.01rem;
  }
}
</style>
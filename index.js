
let gpsData_ = {"data":[{"longtitude":116.662068,"time":"2020-07-29 06:46:27","latitude":40.02548},{"longtitude":116.661016,"time":"2020-07-29 06:46:37","latitude":40.027738},{"longtitude":116.660259,"time":"2020-07-29 06:46:47","latitude":40.029363},{"longtitude":116.659481,"time":"2020-07-29 06:46:57","latitude":40.031018},{"longtitude":116.658465,"time":"2020-07-29 06:47:07","latitude":40.033221},{"longtitude":116.657738,"time":"2020-07-29 06:47:17","latitude":40.034816},{"longtitude":116.657,"time":"2020-07-29 06:47:27","latitude":40.036391},{"longtitude":116.655393,"time":"2020-07-29 06:47:35","latitude":40.03976},{"longtitude":116.655393,"time":"2020-07-29 06:47:35","latitude":40.03976},{"longtitude":116.655968,"time":"2020-07-29 06:47:37","latitude":40.03861},{"longtitude":116.655105,"time":"2020-07-29 06:47:47","latitude":40.040386},{"longtitude":116.654249,"time":"2020-07-29 06:47:57","latitude":40.042298},{"longtitude":116.653111,"time":"2020-07-29 06:48:07","latitude":40.044684},{"longtitude":116.652263,"time":"2020-07-29 06:48:17","latitude":40.04632},{"longtitude":116.651388,"time":"2020-07-29 06:48:27","latitude":40.04792},{"longtitude":116.650121,"time":"2020-07-29 06:48:37","latitude":40.050058},{"longtitude":116.649113,"time":"2020-07-29 06:48:47","latitude":40.051641},{"longtitude":116.648016,"time":"2020-07-29 06:48:57","latitude":40.053255},{"longtitude":116.646558,"time":"2020-07-29 06:49:07","latitude":40.055395},{"longtitude":116.645498,"time":"2020-07-29 06:49:17","latitude":40.056943},{"longtitude":116.644466,"time":"2020-07-29 06:49:27","latitude":40.058455},{"longtitude":116.643101,"time":"2020-07-29 06:49:37","latitude":40.060468},{"longtitude":116.642048,"time":"2020-07-29 06:49:47","latitude":40.062016},{"longtitude":116.640955,"time":"2020-07-29 06:49:57","latitude":40.06361},{"longtitude":116.639486,"time":"2020-07-29 06:50:07","latitude":40.065758},{"longtitude":116.63832,"time":"2020-07-29 06:50:17","latitude":40.067356},{"longtitude":116.637156,"time":"2020-07-29 06:50:27","latitude":40.06885}]}
let colors = ['red', 'blue', 'DeepSkyBlue', 'green', 'MediumSpringGreen', 'Cornislk']; // 默认颜色池
const center = new BMap.Point(116.3964,39.9093); // 默认地图中心
let gpsDataType_ = 'wgs84_bd09'; // 默认gps 转换格式
let samplingRate = 5; // gps点采样显示率
let zoom = 15;  // 地图默认缩放
let offsetX = undefined; // 文字 x偏移
let offsetY = undefined; // 文字 y偏移


function initMap(){
    // 初始化地图
    let map = new BMap.Map("container");
    map.centerAndZoom(center, 10);
    map.enableScrollWheelZoom();

    return map
}

function formatData(gpsData = gpsData_, gpsDataType = gpsDataType_){
    // dataType = wgs84_gcj02\wgs84_bd09\gcj02_wgs84\gcj02_bd09\bd09_wgs84\bd09_gcj02
    // 格式化数据
    if(gpsData instanceof Object ){
        //防止轨迹乱画，对GPS点进行排序
       try{
           if(gpsData[0].time){
               gpsData.sort((a,b) =>{
                   return new Date(a.time).getTime() - new Date(b.time).getTime()
               })
           }
       }catch(err){

       };
       //将原始坐标转换为百度坐标
       var gpsArr = [];
       for(let i = 0; i<gpsData.length;i++){
           var item = gpsData[i];

           var gpsObj = baiduGps({
           lon: item.longtitude,
           lat: item.latitude
           }, gpsDataType);
           gpsArr.push({...item, ...gpsObj});
       }
   }
   return gpsArr
}


// 绘图
function draw(map, data, dataType,showType){
    let data_ = data.data;

    data_.map((d, i) => {
        let gps = formatData(d, dataType)
        let conf = {
            color: colors[i],
            weight: 3,
            opacity: 0.5
        }

        if(showType == 'line'){
            drawLine(map, gps, conf)
        }else if(showType == 'points'){
            console.log(8);
            drawPoints(map, gps, conf)
        }
    })
}


// 绘线
function drawLine(map, data, config){
    let arrPois = [];
    data.map((d, i)=>{
        var p0 = +d.lon;
        var p1_ = +d.lat;
        console.log(p0);
        console.log(p1_);
        // var checksum = makerArry[i].checksum;
        var point = new BMap.Point(p0, p1_); //118.230272,33.482474
        arrPois.push(point);
        console.log(point);
    })
    console.log(arrPois);
    var polyLine = new BMap.Polyline(arrPois,{
        strokeColor: config.color || 'blue', //设置颜色
        strokeWeight: config.weight || 5, //宽度
        strokeOpacity: config.opacity || 0.5 //透明度
    })

    
    map.setViewport(arrPois);
    map.addOverlay(polyLine);
    // 添加起始点
    var myP1 = arrPois[0];
    var myP3 = arrPois[arrPois.length - 1];

    var sIcon = new BMap.Icon(
        'static/img/spoint.png',
        new BMap.Size(29, 80)
    );
    var eIcon = new BMap.Icon(
        'static/img/epoint.png',
        new BMap.Size(29, 80)
    );
    var m1 = new BMap.Marker(myP1, { icon: sIcon }); //创建marker
    var m3 = new BMap.Marker(myP3, { icon: eIcon });
    console.log(myP1);
    console.log(myP3);
    map.addOverlay(m1);
    map.addOverlay(m3);
}


// 绘点
function drawPoints(map, data, config){
    let myIcon = new BMap.Icon('static/img/marker.png', new BMap.Size(29, 80))
    data.map((d, i) => {
        let point = undefined;
        if (!(i % samplingRate)){
            point = new BMap.Point(+d.lon, +d.lat)
            let marker = new BMap.Marker(point, {icon: myIcon})
            let labelS = new BMap.Label(`<span class=my-label>${d.text}<span>` || '默认文字',{offset: new BMap.Size(offsetX || 20,offsetY || -10)} );
            labelS.setStyle({
                color: config.color || 'blue',
                backgroundColor: 'white',
                border:'none'
            })
            marker.setLabel(labelS)

            map.addOverlay(marker)
        }

        if( i == data.length - 1){
            point ? map.panTo(point): map.panTo(new BMap.Point(+d.lon, +d.lat));
            map.setZoom(zoom)
        }
    })
}

// 事件
function handleKeyDown(e){
    let H_KEY = 72;

    switch (e.keyCode) {
        case H_KEY:
            // e.altKey && _this.show_or_hide_front_label() && e.preventDefault();break;
            if(e.altKey){
                let show = $('.my-label').parent().css('display');
               $('.my-label').parent().css({'display': show == 'block'? 'none': 'block'})
            }
        default:break
    }
}


// 转换关系
function baiduGps(points, type){
    // 北京提供计算
    var pi = Math.PI;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

    //世界大地坐标转为百度坐标
    function wgs2bd(lat, lon) {
        var wgs2gcjR = wgs2gcj(lat, lon);
        var gcj2bdR = gcj2bd(wgs2gcjR.lat, wgs2gcjR.lon);
        return gcj2bdR;
    }

    function bd2wgs(lat, lon){
        var bd2gcjR = bd2gcj(lat, lon);
        var gcj2wgsR = gcj2wgs(bd2gcjR.lat, bd2gcjR.lon);
        return gcj2wgsR
    }

    function delta(lat, lon){
        var dLat = transformLat(lon - 105.0, lat - 35.0);
        var dLon = transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * pi);
        dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * pi);

        return {'lat': dLat, 'lon': dLon}
    }

    function gcj2bd(lat, lon) {
        var x = lon,
            y = lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        var bd_lon = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return {
            lat: bd_lat.toFixed(6),
            lon: bd_lon.toFixed(6)
        };
    }

    function bd2gcj(lat, lon) {
        var x = lon - 0.0065,
            y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lon = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return {
            lat: gg_lat,
            lon: gg_lon
        };
    }

    function wgs2gcj(lat, lon) {
        // var dLat = transformLat(lon - 105.0, lat - 35.0);
        // var dLon = transformLon(lon - 105.0, lat - 35.0);
        // var radLat = lat / 180.0 * pi;
        // var magic = Math.sin(radLat);
        // magic = 1 - ee * magic * magic;
        // var sqrtMagic = Math.sqrt(magic);
        // dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * pi);
        // dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * pi);
        // var mgLat = lat + dLat;
        // var mgLon = lon + dLon;
        // return {
        //     lat: mgLat,
        //     lon: mgLon
        // };
        var delta_res = delta(lat, lon)

        return {
            lat: lat + delta_res.lat,
            lon: lon + delta_res.lon
        };
    }

    function gcj2wgs(lat, lon){
        var delta_res = delta(lat, lon)

        return {
            lat: lat - delta_res.lat,
            lon: lon - delta_res.lon
        };
    }

    function transformLat(lat, lon) {
        var ret = -100.0 +
            2.0 * lat +
            3.0 * lon +
            0.2 * lon * lon +
            0.1 * lat * lon +
            0.2 * Math.sqrt(Math.abs(lat));
        ret +=
            (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
            2.0 /
            3.0;
        ret +=
            (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) *
            2.0 /
            3.0;
        ret +=
            (160.0 * Math.sin(lon / 12.0 * pi) +
                320 * Math.sin(lon * pi / 30.0)) *
            2.0 /
            3.0;
        return ret;
    }

    function transformLon(lat, lon) {
        var ret =
            300.0 +
            lat +
            2.0 * lon +
            0.1 * lat * lat +
            0.1 * lat * lon +
            0.1 * Math.sqrt(Math.abs(lat));
        ret +=
            (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
            2.0 /
            3.0;
        ret +=
            (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) *
            2.0 /
            3.0;
        ret +=
            (150.0 * Math.sin(lat / 12.0 * pi) +
                300.0 * Math.sin(lat / 30.0 * pi)) *
            2.0 /
            3.0;
        return ret;
    }

    //根据不同的数据格式返回数据
    if(type == 'WGS84'){
        return wgs2bd(parseFloat(points.lat), parseFloat(points.lon))
    }else if(type == 'GCJ02'){
        return gcj2bd(parseFloat(points.lat), parseFloat(points.lon))
    }else if(type == 'BD09'){
        return points
    }else{
        let resPoint = undefined;
        let lat = parseFloat(points.lat);
        let lng = parseFloat(points.lon);

        switch(type){
            case 'wgs84_gcj02': resPoint = wgs2gcj(lat, lng);break;
            case 'wgs84_bd09': resPoint = wgs2bd(lat, lng);break;
            case 'gcj02_wgs84': resPoint = gcj2wgs(lat, lng);break;
            case 'gcj02_bd09': resPoint = gcj2bd(lat, lng);break;
            case 'bd09_wgs84': resPoint = bd2wgs(lat, lng);break;
            case 'bd09_gcj02': resPoint = bd2gcj(lat, lng);break;
            default:break;
        }

        return {'lat': resPoint.lat, 'lon': resPoint.lon}
    }
}

import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import Leaflet from '@salesforce/resourceUrl/LeafletJS';

export default class OpenStreetMap extends LightningElement {
    map;
    latitude;
    longitude;
    route = [];  // 경로를 저장할 배열
    marker;
    watchId;

    renderedCallback() {
        if (this.map) {
            return; // 이미 로드된 경우 실행 안 함
        }
        Promise.all([
            loadScript(this, Leaflet + '/leaflet.js'),
            loadStyle(this, Leaflet + '/leaflet.css')
        ])
        .then(() => {
            console.log("Leaflet.js loaded successfully");
            this.loadMap();
        })
        .catch(error => {
            console.error("Error loading Leaflet.js", error);
        });
    }

    loadMap() {
        if (!navigator.geolocation) {
            console.error("Geolocation not supported");
            return;
        }
        console.log("load map 실행");
        // 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            const mapContainer = this.template.querySelector('.map-container');
            if (!mapContainer) {
                console.error("Map container not found");
                return;
            }
            mapContainer.style.height = "400px"; // 지도 높이 설정
            // Leaflet 지도 초기화
            this.map = L.map(mapContainer).setView([this.latitude, this.longitude], 13);
            
            // Stadia_AlidadeSmoothDark 타일 레이어 추가
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(this.map);

            // 현재 위치에 마커 표시
            this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map)
                .bindPopup(this.latitude + "," + this.longitude )
                .openPopup();
            
            // 실시간 위치 추적 시작
            this.watchPosition();
        }, error => {
            console.error("Geolocation error:", error);
        });
    }

    watchPosition() {
        // 위치 정보가 바뀔 때마다 호출되는 메서드
        this.watchId = navigator.geolocation.watchPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            // 경로 배열에 현재 위치 추가
            this.route.push([this.latitude, this.longitude]);
            // 마커 위치 업데이트
            if (this.marker) {
                this.marker.setLatLng([this.latitude, this.longitude])
                    .bindPopup(this.latitude + "," + this.longitude)
                    .openPopup();
            }
            // 지도 중앙 업데이트
            if (this.map) {
                this.map.setView([this.latitude, this.longitude]);
            }
            // 경로가 2개 이상이면 경로를 지도에 그리기
            if (this.route.length > 1) {
                L.polyline(this.route, { color: 'blue' }).addTo(this.map);
            }
        }, error => {
            console.error("Error watching position:", error);
        }, {
            enableHighAccuracy: true, // 고정밀 위치 정보 사용
            timeout: 50000, // 타임아웃 설정
            maximumAge: 0 // 캐시된 위치 정보 사용 안 함
        });
    }

    // 컴포넌트가 종료될 때 위치 추적을 중지
    disconnectedCallback() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    }
}
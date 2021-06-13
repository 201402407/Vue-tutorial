<template>
    <div>
        <h1>열차 최단거리 계산</h1>
        <br />
        <h3>입력 BOX</h3>
        <br />
        <h4>출발지</h4>
        역명 :
        <select v-model="startStationName">
            <option v-for="[key, index] in stationCodeMap" :key="index" :value="key">{{ key }}</option>
        </select>
        출발시각 :
        <select>
            출발시간</select
        ><br />
        <h4>도착지</h4>
        역명 :
        <select v-model="endStationName">
            <option v-for="[key, index] in stationCodeMap" :id="index" :key="index" :value="key">{{ key }}</option>
        </select>
        <br /><br /><br /><br />
        <h3>결과 BOX</h3>
        <br />
        <h4>경로 :</h4>
        <h4>도착시각 :</h4>
        <h4>경과시간 :</h4>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

// Map 초기화
// 역명,코드 Map 생성
// 시간표 array 생성
// 출발점 ㅡ 이분탐색
// 1.도착지, 출발지 Map에서 코드로 변경
// 2. 이분탐색으로 출발점 출발시간 및 인덱스 찾기(해당 기차)
// 3. 코드에서 뒷 숫자 1씩 증가시키면서 도착지 코드체크(환승있으면 재귀)
// 4. 도착시간 리턴받고, 도착못하면 0
// 5. 불린으로 체크해서 하나라도 도착시간 받으면 true

@Component
export default class Trail extends Vue {
    private stationCodeMap = new Map<string, string>()
    private scheduleArr = []
    private startStationName = '' // 출발지
    private startStationCode = ''
    private endStationName = '' // 도착지
    private endStationCode = ''

    created() {
        // init 후 DOM 추가 전 호출. DOM에 컴포넌트가 MOUNT 되기 전. $el 사용 X
        console.log('Created!')
        this.init()
    }

    mounted() {
        // 컴포넌트가 DOM에 추가된 후 호출.
        console.log('Mounted!')
        this.$nextTick(() => {
            // 모든 화면이 렌더링 된 후 호출
            console.log('모든 화면 렌더링 완료!')
        })
    }

    get getStartStationName() {
        this.startStationCode = this.getStationCodeForName(this.startStationName)
        return this.startStationName
    }

    get getEndStationName() {
        this.endStationCode = this.getStationCodeForName(this.endStationName)
        return this.endStationName
    }

    init() {
        this.stationCodeMap = this.setStationCode()
    }

    // CodeMap 초기화 및 역명, 코드 키-값 생성
    setStationCode(): Map<string, string> {
        const map = new Map<string, string>()
        // 1호선
        map.set('구로', 'i01')
        map.set('신도림', 'i02')
        map.set('영등포', 'i03')
        map.set('신길', 'i04')
        map.set('대방', 'i05')
        map.set('노량진', 'i06')
        map.set('용산', 'i07')
        map.set('남영', 'i08')
        map.set('서울역', 'i09')
        map.set('시청', 'i10')
        map.set('종각', 'i11')
        map.set('종로3가', 'i12')
        map.set('종로5가', 'i13')
        // 2호선
        map.set('대림', 'j01')
        map.set('신도림', 'j02')
        map.set('문래', 'j03')
        map.set('영등포구청', 'j04')
        map.set('당산', 'j05')
        map.set('합정', 'j06')
        map.set('홍대입구', 'j07')
        map.set('신촌', 'j08')
        map.set('이대', 'j09')
        map.set('아현', 'j10')
        map.set('충정로', 'j11')
        map.set('시청', 'j12')
        // 3호선
        map.set('양평', 'k01')
        map.set('영등포구청', 'k02')
        map.set('영등포시장', 'k03')
        map.set('신길', 'k04')
        map.set('여의도', 'k05')
        map.set('여의나루', 'k06')
        map.set('마포', 'k07')
        map.set('공덕', 'k08')
        map.set('애오개', 'k09')
        map.set('충정로', 'k10')
        map.set('서대문', 'k11')
        map.set('광화문', 'k12')
        map.set('종로3가', 'k13')
        map.set('을지로4가', 'k14')

        return map
    }

    getStationNameForCode(code: string) {
        for (let [key, value] of this.stationCodeMap.entries()) {
            if (value === code) {
                console.log(key)
                return key
            }
        }
    }

    getStationCodeForName(name: string) {
        let temp = ''
        // for (let [key, value] of this.stationCodeMap.entries()) {
        //     alert(key + ' , ' + value)
        //     if (name === key) {
        //         console.log(value)
        //         return value
        //     }
        // }
        console.log(name)
        this.stationCodeMap.forEach((value, key, mapObj) => {
            if (key === name) {
                console.log(`${key} and ${value}`)
                temp = value
                return
            }
        })

        return temp
    }

    // 시간표 array 생성
    setTrailSchedule() {
        const arr = [
            // schedule array의 index는 1,2,3 ~ 번 순서의 호차
            { code: 'i01', schedule: [850, 940, 1030, 1120, 1210, 1300] },
            { code: 'i02', schedule: [900, 950, 1040, 1130, 1220, 1310] },
        ]
    }
}
</script>

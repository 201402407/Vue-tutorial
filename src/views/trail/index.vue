<template>
    <div>
        <h1>열차 최단거리 계산</h1>
        <br />
        <h3>입력 BOX</h3>
        <br />
        <h4>출발지</h4>
        역명 :
        <select v-model="startStationName">
            <option v-for="[key, index] in stationCodeMap" :key="index" :value="key">
                {{ key }}
            </option>
        </select>
        출발시각 :
        <input type="text" placeholder="HH:MM" v-model="startTime" />
        <br />
        <h4>도착지</h4>
        역명 :
        <select v-model="endStationName">
            <option v-for="[key, index] in stationCodeMap" :id="index" :key="index" :value="key">
                {{ key }}
            </option>
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
import { Vue, Component, Emit, Watch } from 'vue-property-decorator'

// Map 초기화
// 역명,코드 Map 생성
// 시간표 array 생성
// 출발점 ㅡ 이분탐색
// 1.도착지, 출발지 Map에서 코드로 변경
// 2. 이분탐색으로 출발점 출발시간 및 인덱스 찾기(해당 기차)
// 3. 코드에서 뒷 숫자 1씩 증가시키면서 도착지 코드체크(환승있으면 재귀)
// 4. 도착시간 리턴받고, 도착못하면 0
// 5. 불린으로 체크해서 하나라도 도착시간 받으면 true

interface ScheduleType {
    code: string
    schedule: number[]
    transferCode: string
}

interface DistanceType {
    distance: string[]
    endTime: string
    spendTime: string
}

@Component
export default class Trail extends Vue {
    private stationCodeMap = new Map<string, string>()
    private scheduleArr: Array<ScheduleType> | undefined
    private startStationName = '' // 출발지
    private startStationCode = ''
    private startTime = ''
    private startHour = ''
    private startMinute = ''
    private endStationName = '' // 도착지
    private endStationCode = ''
    private arr1: Array<ScheduleType> = [] // 1호선
    private arr2: Array<ScheduleType> = [] // 2호선
    private arr3: Array<ScheduleType> = [] // 3호선
    private lineNumberType = new Map<string, string>([
        ['i', '1'],
        ['j', '2'],
        ['k', '3'],
    ])
    private lineArrType = new Map<string, Array<ScheduleType>>([
        ['i', this.arr1],
        ['j', this.arr2],
        ['k', this.arr3],
    ])

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
        this.validStationInput()
        return this.startStationName
    }

    get getEndStationName() {
        this.endStationCode = this.getStationCodeForName(this.endStationName)
        this.validStationInput()
        return this.endStationName
    }

    // HH:MM을 HH, MM으로 나누기
    @Watch('startTime')
    splitStartTime() {
        if (this.startTime.length !== 5) {
            return
        }

        if (this.startTime.indexOf(':') == 2) {
            this.startHour = this.startTime.split(':')[0]
            this.startMinute = this.startTime.split(':')[1]
        }
    }

    getLineNumber(stationCodeChar: string) {
        return this.lineNumberType.get(stationCodeChar)
    }

    getLineArr(stationCodeChar: string) {
        return this.lineArrType.get(stationCodeChar)
    }

    init() {
        this.stationCodeMap = this.setStationCode()
        this.setTrailSchedule()
    }

    // 열차 최단거리 계산을 위한 입력값 검증
    validStationInput() {
        if (this.startStationName !== '' && this.endStationName !== '' && this.startTime !== '' && this.startTime.length == 5) {
            // 계산 시작
            const distance = this.carculateTrainDistance()
            if (!distance) {
                // 경로 미존재
                alert('경로 미존재')
                return
            }

            // 경로 존재
            alert('경로 존재')
            console.log(distance)
        }
    }

    // 열차 최단거리 계산
    carculateTrainDistance(): DistanceType | undefined {
        // 로직 시작
        let startStationCode = this.startStationCode
        let endStationCode = this.endStationCode
        let startTime: number = Number(this.startTime.replace(':', ''))
        let lineArr = this.getLineArr(startStationCode[0])!
        let startTrainIndex = this.searchStartTrainIndex(startStationCode, startTime)
        if (startTrainIndex === -1) {
            return undefined
        }

        let result: DistanceType = {
            distance: [],
            endTime: '',
            spendTime: '',
        }
        result.distance.push(this.startStationName)
        return this.searchSameTrainLine(startStationCode, endStationCode, lineArr, Number(startStationCode.substring(1)), result)
    }

    // 이분탐색을 통해 시작역에서 탑승한 열차 호 수 구하기
    // @return -1 : false
    // @param startStationCode: ex) i02(string), startTime: HHMM(number)
    searchStartTrainIndex(startStationCode: string, startTime: number): number {
        const lineArr = this.getLineArr(startStationCode[0])
        if (lineArr === undefined) {
            return -1
        }

        const startScheduleType = lineArr.find((scheduleType) => scheduleType.code === startStationCode)
        const lineCount = lineArr.length // startStationCode[0] 은 코드명의 알파벳
        if (lineCount === undefined || lineCount === 0) {
            return -1
        }

        let startIndex = 0
        let endIndex = lineCount - 1
        let midIndex: number

        while (startIndex <= endIndex) {
            midIndex = (startIndex + endIndex) / 2
            if (startTime == startScheduleType?.schedule[midIndex]!) {
                return midIndex
            } else {
                if (startTime < startScheduleType?.schedule[midIndex]!) {
                    endIndex = midIndex - 1
                } else {
                    startIndex = midIndex + 1
                }
            }
        }

        if (startIndex >= lineCount) {
            return lineCount - 1
        }

        return startIndex
    }

    // 같은 호선 내에서 도착하는지 찾기(출발과 도착의 호선이 다르면 환승 체크해서 재귀)
    searchSameTrainLine(startStationCode: string, endStationCode: string, startLineArr: Array<ScheduleType>, lineNumber: number, resultDistance: DistanceType) {
        const startStationChar = startStationCode[0]
        const startStationNumber = Number(startStationCode.substr(1))
        const endStationChar = endStationCode[0]
        const endStartionNumber = endStationCode.substr(1)
        let index = startStationNumber
        let tempResult = resultDistance

        for (; index < startLineArr.length; index++) {
            if (endStationCode === startLineArr[index].code) {
                // 목적지에 도착
                let temp: DistanceType = {
                    distance: resultDistance.distance,
                    endTime: '',
                    spendTime: '',
                }

                const endTimeStr = String(startLineArr[index].schedule[lineNumber])
                temp.endTime = endTimeStr.substring(0, 2).concat(':', endTimeStr.substring(2, 4))
                temp.distance.push(this.getStationNameForCode(endStationCode)!)
                tempResult = this.compareDistanceTypeForEndTime(tempResult, temp)
                break // TODO: 여차하면 for문 다돌게?
            }

            if (startLineArr[index].transferCode !== '') {
                // 환승 여부 존재
                const transferStationCode = startLineArr[index].transferCode
                let temp: DistanceType = {
                    distance: resultDistance.distance,
                    endTime: '',
                    spendTime: '',
                }
                temp.distance.push(this.getStationNameForCode(transferStationCode)!)
                temp = this.searchSameTrainLine(
                    transferStationCode,
                    endStationCode,
                    this.getLineArr(transferStationCode)!,
                    this.searchStartTrainIndex(transferStationCode, startLineArr[index].schedule[lineNumber]),
                    temp
                )!

                if (temp.endTime !== '') {
                    tempResult = this.compareDistanceTypeForEndTime(tempResult, temp)!
                }
            }
        }

        return tempResult
    }

    // 두 목적지까지의 최단거리 결과 객체 중 더 짧은 거리의 객체 리턴
    compareDistanceTypeForEndTime(aDistance: DistanceType, bDistance: DistanceType) {
        if (aDistance.endTime === '') {
            return bDistance
        }

        if (bDistance.endTime === '') {
            return aDistance
        }

        if (aDistance.endTime.localeCompare(bDistance.endTime) <= 0) {
            // 같음
            return aDistance
        }

        return bDistance
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
        this.arr1 = [
            // 1호선
            { code: 'i01', schedule: [850, 940, 1030, 1120, 1210, 1300], transferCode: '' },
            { code: 'i02', schedule: [900, 950, 1040, 1130, 1220, 1310], transferCode: 'j02' },
            { code: 'i03', schedule: [910, 1000, 1050, 1140, 1230, 1320], transferCode: '' },
            { code: 'i04', schedule: [915, 1005, 1055, 1145, 1235, 1325], transferCode: 'k04' },
            { code: 'i05', schedule: [920, 1010, 1100, 1150, 1240, 1330], transferCode: '' },
            { code: 'i06', schedule: [930, 1020, 1110, 1200, 1250, 1340], transferCode: '' },
            { code: 'i07', schedule: [935, 1025, 1115, 1205, 1255, 1345], transferCode: '' },
            { code: 'i08', schedule: [940, 1030, 1120, 1210, 1300, 1350], transferCode: '' },
            { code: 'i09', schedule: [950, 1040, 1130, 1220, 1310, 1400], transferCode: '' },
            { code: 'i10', schedule: [955, 1045, 1135, 1225, 1315, 1405], transferCode: 'j12' },
            { code: 'i11', schedule: [1000, 1050, 1140, 1230, 1320, 1410], transferCode: '' },
            { code: 'i12', schedule: [1005, 1055, 1145, 1235, 1325, 1415], transferCode: 'k13' },
            { code: 'i13', schedule: [1010, 1100, 1150, 1240, 1330, 1420], transferCode: '' },
        ]

        this.arr2 = [
            // 2호선
            { code: 'j01', schedule: [905, 1005, 1105, 1205, 1305], transferCode: '' },
            { code: 'j02', schedule: [920, 1020, 1120, 1220, 1320], transferCode: 'i02' },
            { code: 'j03', schedule: [925, 1025, 1125, 1225, 1325], transferCode: '' },
            { code: 'j04', schedule: [930, 1030, 1130, 1230, 1330], transferCode: 'k02' },
            { code: 'j05', schedule: [940, 1040, 1140, 1240, 1340], transferCode: '' },
            { code: 'j06', schedule: [945, 1045, 1145, 1245, 1345], transferCode: '' },
            { code: 'j07', schedule: [950, 1050, 1150, 1250, 1350], transferCode: '' },
            { code: 'j08', schedule: [955, 1055, 1155, 1255, 1355], transferCode: '' },
            { code: 'j09', schedule: [1005, 1105, 1205, 1305, 1405], transferCode: '' },
            { code: 'j10', schedule: [1010, 1110, 1210, 1310, 1410], transferCode: '' },
            { code: 'j11', schedule: [1015, 1115, 1215, 1315, 1415], transferCode: 'k10' },
            { code: 'j12', schedule: [1020, 1120, 1220, 1320, 1420], transferCode: 'i10' },
        ]

        this.arr3 = [
            // 3호선
            { code: 'k01', schedule: [930, 1010, 1050, 1130, 1210, 1250], transferCode: '' },
            { code: 'k02', schedule: [940, 1020, 1100, 1140, 1220, 1300], transferCode: 'j04' },
            { code: 'k03', schedule: [945, 1025, 1105, 1145, 1225, 1305], transferCode: '' },
            { code: 'k04', schedule: [955, 1035, 1115, 1155, 1235, 1315], transferCode: 'i04' },
            { code: 'k05', schedule: [1005, 1045, 1125, 1205, 1245, 1325], transferCode: '' },
            { code: 'k06', schedule: [1010, 1050, 1130, 1210, 1250, 1330], transferCode: '' },
            { code: 'k07', schedule: [1020, 1100, 1140, 1220, 1300, 1340], transferCode: '' },
            { code: 'k08', schedule: [1025, 1105, 1145, 1225, 1305, 1345], transferCode: '' },
            { code: 'k09', schedule: [1030, 1110, 1150, 1230, 1310, 1350], transferCode: '' },
            { code: 'k10', schedule: [1035, 1115, 1155, 1235, 1315, 1355], transferCode: 'j11' },
            { code: 'k11', schedule: [1040, 1120, 1200, 1240, 1320, 1400], transferCode: '' },
            { code: 'k12', schedule: [1045, 1125, 1205, 1245, 1325, 1405], transferCode: '' },
            { code: 'k13', schedule: [1050, 1130, 1210, 1250, 1330, 1410], transferCode: 'i12' },
            { code: 'k14', schedule: [1100, 1140, 1220, 1300, 1340, 1420], transferCode: '' },
        ]

        // const arr = [
        //     // schedule array의 index는 1,2,3 ~ 번 순서의 호차
        //     // 1호선
        //     { code: 'i01', schedule: [850, 940, 1030, 1120, 1210, 1300] },
        //     { code: 'i02', schedule: [900, 950, 1040, 1130, 1220, 1310] },
        //     { code: 'i03', schedule: [910, 1000, 1050, 1140, 1230, 1320] },
        //     { code: 'i04', schedule: [915, 1005, 1055, 1145, 1235, 1325] },
        //     { code: 'i05', schedule: [920, 1010, 1100, 1150, 1240, 1330] },
        //     { code: 'i06', schedule: [930, 1020, 1110, 1200, 1250, 1340] },
        //     { code: 'i07', schedule: [935, 1025, 1115, 1205, 1255, 1345] },
        //     { code: 'i08', schedule: [940, 1030, 1120, 1210, 1300, 1350] },
        //     { code: 'i09', schedule: [950, 1040, 1130, 1220, 1310, 1400] },
        //     { code: 'i10', schedule: [955, 1045, 1135, 1225, 1315, 1405] },
        //     { code: 'i11', schedule: [1000, 1050, 1140, 1230, 1320, 1410] },
        //     { code: 'i12', schedule: [1005, 1055, 1145, 1235, 1325, 1415] },
        //     { code: 'i13', schedule: [1010, 1100, 1150, 1240, 1330, 1420] },
        //     // 2호선
        //     { code: 'j01', schedule: [905, 1005, 1105, 1205, 1305] },
        //     { code: 'j02', schedule: [920, 1020, 1120, 1220, 1320] },
        //     { code: 'j03', schedule: [925, 1025, 1125, 1225, 1325] },
        //     { code: 'j04', schedule: [930, 1030, 1130, 1230, 1330] },
        //     { code: 'j05', schedule: [940, 1040, 1140, 1240, 1340] },
        //     { code: 'j06', schedule: [945, 1045, 1145, 1245, 1345] },
        //     { code: 'j07', schedule: [950, 1050, 1150, 1250, 1350] },
        //     { code: 'j08', schedule: [955, 1055, 1155, 1255, 1355] },
        //     { code: 'j09', schedule: [1005, 1105, 1205, 1305, 1405] },
        //     { code: 'j10', schedule: [1010, 1110, 1210, 1310, 1410] },
        //     { code: 'j11', schedule: [1015, 1115, 1215, 1315, 1415] },
        //     { code: 'j12', schedule: [1020, 1120, 1220, 1320, 1420] },
        //     // 3호선
        //     { code: 'k01', schedule: [930, 1010, 1050, 1130, 1210, 1250] },
        //     { code: 'k02', schedule: [940, 1020, 1100, 1140, 1220, 1300] },
        //     { code: 'k03', schedule: [945, 1025, 1105, 1145, 1225, 1305] },
        //     { code: 'k04', schedule: [955, 1035, 1115, 1155, 1235, 1315] },
        //     { code: 'k05', schedule: [1005, 1045, 1125, 1205, 1245, 1325] },
        //     { code: 'k06', schedule: [1010, 1050, 1130, 1210, 1250, 1330] },
        //     { code: 'k07', schedule: [1020, 1100, 1140, 1220, 1300, 1340] },
        //     { code: 'k08', schedule: [1025, 1105, 1145, 1225, 1305, 1345] },
        //     { code: 'k09', schedule: [1030, 1110, 1150, 1230, 1310, 1350] },
        //     { code: 'k10', schedule: [1035, 1115, 1155, 1235, 1315, 1355] },
        //     { code: 'k11', schedule: [1040, 1120, 1200, 1240, 1320, 1400] },
        //     { code: 'k12', schedule: [1045, 1125, 1205, 1245, 1325, 1405] },
        //     { code: 'k13', schedule: [1050, 1130, 1210, 1250, 1330, 1410] },
        //     { code: 'k14', schedule: [1100, 1140, 1220, 1300, 1340, 1420] },
        // ]
    }
}
</script>

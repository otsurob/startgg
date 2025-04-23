import { poolResponses, Pools } from "../types/types";

export function setPools(poolResponses : poolResponses): Pools[] {
    const letterMap = new Map<string, Pools>();
    for(const {pool, gamerTag} of poolResponses){
        const letter = pool[0];

        // ブロック（A, B のWAVE）作成
        if(!letterMap.has(letter)){
            letterMap.set(letter, {letter, poolNums: []});
        }
        const block = letterMap.get(letter);

        // プール作成
        let poolObj = block?.poolNums.find(p => p.poolNum === pool);
        if(!poolObj){
            poolObj = {poolNum: pool, players: []};
            block?.poolNums.push(poolObj);
        }

        // プレイヤーの重複防止
        if(!poolObj.players.includes(gamerTag)){
            poolObj.players.push(gamerTag);
        }
    }

    // ソート処理
    return Array.from(letterMap.values()).map(b => ({
        ...b,
        poolNums: b.poolNums.sort((a, b) => {
            // a.poolNum.localeCompare(b.poolNum)
            const [aWave, aPool] = [a.poolNum[0], parseInt(a.poolNum.slice(1), 10)];
            const [bWave, bPool] = [b.poolNum[0], parseInt(b.poolNum.slice(1), 10)];
            if(aWave < bWave) return -1;
            if(aWave > bWave) return 1;

            return aPool - bPool;
        }),
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));
}
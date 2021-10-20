
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.17.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.110.0/testing/asserts.ts';


function parseTuple(str: any): any {
    let tempStr = str.replace("level", `"level"`);
    tempStr = tempStr.replace("n-skills", `"n-skills"`);
    tempStr = tempStr.replace("type", `"type"`);
    let matches = [];
    matches = tempStr.match(/u([0-9]+),/g) as Array<string>;
    tempStr = tempStr.replace(matches[0], `"${matches[0].substring(0, matches[0].length - 1)}",`);
    tempStr = tempStr.replace(matches[1], `"${matches[1].substring(0, matches[1].length - 1)}",`);
    // console.log(tempStr);
    return JSON.parse(tempStr);
};

Clarinet.test({
    name: "Ensure that we can find level",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployerWallet = accounts.get("deployer") as Account;
        let wallet1 = accounts.get("wallet_1") as Account;
        let wallet2 = accounts.get("wallet_2") as Account;


        chain.mineEmptyBlockUntil(1);
        let temp = [];
        for(let i = 0; i < 32; i++) {
            temp.push(0);
        } 
        // {
        //     "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0,
        //     "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0,
        //     "20": 0, "21": 0, "22": 0, "23": 0, "24": 0, "25": 0, "26": 0, "27": 0, "28": 0, "29": 0,
        //     "30": 0, "31": 0, "32": 0,
        // };

        // let block = chain.mineBlock([
        //     Tx.contractCall(
        //         `card`,
        //         "get-card-level",
        //         [],
        //         deployerWallet.address
        //     ),
        //     Tx.contractCall(
        //         `card`,
        //         "get-block-height-rand",
        //         [],
        //         deployerWallet.address
        //     ),
        //     Tx.contractCall(
        //         `card`,
        //         "get-card-level",
        //         [],
        //         deployerWallet.address
        //     ),
        //     Tx.contractCall(
        //         `card`,
        //         "get-block-height-rand",
        //         [],
        //         deployerWallet.address
        //     ),
        //     Tx.contractCall(
        //         `card`,
        //         "get-card-level",
        //         [],
        //         deployerWallet.address
        //     ),
        //     Tx.contractCall(
        //         `card`,
        //         "get-block-height-rand",
        //         [],
        //         deployerWallet.address
        //     ),
        // ]);
        // console.log(block.receipts)
        // console.log(temp[31]);

        // for(let i = 0; i < 8; i++) {
        //     for(let j = 0; j < 64; j++) {
        //         let block = chain.mineBlock([
        //             Tx.contractCall(
        //                 `card`,
        //                 "get-last-token-id",
        //                 [],
        //                 deployerWallet.address
        //             ),
        //             Tx.contractCall(
        //                 `card`,
        //                 "get-card-level",
        //                 [],
        //                 deployerWallet.address
        //             ),
        //         ]);
        //         let type = block.receipts[0].result;
        //         // console.log(type);
        //         let num = parseInt(block.receipts[1].result.expectOk().substring(1, block.receipts[1].result.expectOk().length));
        //         // console.log(temp[31]);
        //         temp[num] = temp[num] + 1;
        //     }
        // }


        let stats: any = {
            levels: {
                    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0,
                    "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0,
                    "20": 0, "21": 0, "22": 0, "23": 0, "24": 0, "25": 0, "26": 0, "27": 0, "28": 0, "29": 0,
                    "30": 0, "31": 0, "32": 0,
                },
            nSkills : {
                // 0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                // 5: 0,
                // 6: 0,
                // 7: 0,
            },
            types : {
                "Person": 0,
                "Robot": 0,
                "Creature": 0,
                "Animal": 0,
            },
        };

        // for(let i = 0; i < 32; i++) {
        //     stats.levels.push(0);
        // } 

        // stats.nSkills.push(0);
        // stats.nSkills.push(0);
        // stats.nSkills.push(0);
        // stats.nSkills.push(0);

        for(let j = 0; j < 80; j++) {
            for(let i = 0; i < 64; i++) {
                let block = chain.mineBlock([
                    Tx.contractCall(
                        `card`,
                        "mint",
                        [],
                        wallet1.address
                    ),
                ]);
                // console.log(temp[31]);
            }
        }
        let cards = [];
        for(let j = 0; j < 5000; j++) {
            let block = chain.mineBlock([
                Tx.contractCall(
                    `card`,
                    "get-token-attributes",
                    [types.uint(j)],
                    wallet1.address
                ),
            ]);
            let type = block.receipts[0].result.expectSome();
            let parsedType : any = parseTuple(type);
            let level = parseInt(parsedType.level.substring(1, parsedType.level.length));
            let nSkills = parseInt(parsedType["n-skills"].substring(1, parsedType["n-skills"].length));
            // console.log(temp[31]);
            // console.log(parsedType.level);
            stats.levels[level] = stats.levels[level] + 1;
            stats.nSkills[nSkills] = stats.nSkills[nSkills] + 1;
            stats.types[parsedType.type] = stats.types[parsedType.type] + 1;
            cards.push({level, nSkills, type: parsedType.type});
        }
        // console.log(JSON.stringify(cards));
        // console.log(stats);
        let block = chain.mineBlock([
            Tx.contractCall(
                `card`,
                "mint",
                [],
                wallet1.address
            ),
        ]);

        // console.log(block.receipts[0].result);


        // console.log(stats.types["Person"])
        // assertEquals(block.receipts.length, 0);
        // assertEquals(block.height, 2);
    },
});
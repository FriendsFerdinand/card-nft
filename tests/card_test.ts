
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.17.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.110.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that we can find the min and max of our value",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployerWallet = accounts.get("deployer") as Account;
        let wallet1 = accounts.get("wallet_1") as Account;
        let wallet2 = accounts.get("wallet_2") as Account;


        chain.mineEmptyBlockUntil(10);

        let input = {
            min: types.uint(80),
            max: types.uint(120)
        }

        let block = chain.mineBlock([
            Tx.contractCall(
                `card`,
                "get-random-val",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "is-inside-edges",
                [types.uint(10), types.uint(50), types.uint(11)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "is-inside-edges",
                [types.uint(10), types.uint(50), types.uint(50)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "is-inside-edges",
                [types.uint(10), types.uint(50), types.uint(49)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "is-inside-edges",
                [types.uint(10), types.uint(50), types.uint(10)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(10)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-is-inside",
                [types.tuple({min: types.uint(10), max: types.uint(50)})],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-is-inside",
                [types.tuple({min: types.uint(10), max: types.uint(50)})],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(9)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-is-inside",
                [types.tuple({min: types.uint(10), max: types.uint(50)})],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(49)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-is-inside",
                [types.tuple({min: types.uint(10), max: types.uint(50)})],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(50)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-is-inside",
                [types.tuple({min: types.uint(10), max: types.uint(50)})],
                deployerWallet.address
            ),
        ]);
        // console.log(block.receipts);
        // assertEquals(block.receipts.length, 0);
        // assertEquals(block.height, 2);

        block = chain.mineBlock([
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(0)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(5)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(15)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(34)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(66)],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(241)],
                deployerWallet.address
            ),
            Tx.contractCall( //11
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(251)],
                deployerWallet.address
            ),
            Tx.contractCall( //13
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-set-val",
                [types.uint(256)],
                deployerWallet.address
            ),
            Tx.contractCall( //15
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall( 
                `card`,
                "dummy-get-level",
                [types.uint(123)],
                deployerWallet.address
            ),
            Tx.contractCall( //17
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
            Tx.contractCall(
                `card`,
                "dummy-get-level",
                [types.uint(246)],
                deployerWallet.address
            ),
            Tx.contractCall( //19
                `card`,
                "dummy-get-edges",
                [],
                deployerWallet.address
            ),
        ]);
        
        let edgeRes = block.receipts[1].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(10)}, min: ${types.uint(0)}, pos: ${types.uint(0)}}`);
        edgeRes = block.receipts[3].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(10)}, min: ${types.uint(0)}, pos: ${types.uint(0)}}`);
        edgeRes = block.receipts[5].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(66)}, min: ${types.uint(10)}, pos: ${types.uint(1)}}`);
        edgeRes = block.receipts[7].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(66)}, min: ${types.uint(10)}, pos: ${types.uint(1)}}`);
        edgeRes = block.receipts[9].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(130)}, min: ${types.uint(66)}, pos: ${types.uint(2)}}`);
        edgeRes = block.receipts[11].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(248)}, min: ${types.uint(190)}, pos: ${types.uint(4)}}`);
        edgeRes = block.receipts[13].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(256)}, min: ${types.uint(248)}, pos: ${types.uint(5)}}`);
        edgeRes = block.receipts[15].result.expectList();
        assertEquals(edgeRes[0], undefined);

        edgeRes = block.receipts[17].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(130)}, min: ${types.uint(66)}, pos: ${types.uint(2)}}`);

        edgeRes = block.receipts[19].result.expectList();
        assertEquals(edgeRes[0], `{max: ${types.uint(248)}, min: ${types.uint(190)}, pos: ${types.uint(5)}}`);
    },
});

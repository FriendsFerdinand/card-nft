;; mainnet
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(use-trait nft 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; testnet
;; (impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait)

(define-non-fungible-token card uint)
(define-data-var MINT_COST uint u20000000)
(define-data-var card-pos uint u0)

(define-data-var block-height-rand uint u0)

(define-constant MINT_LIMIT u5000)
(define-constant CONTRACT_DEPLOYER tx-sender)
(define-map fixed-card-attributes uint
    {
        type: (string-ascii 32),
        level: uint,
        n-skills: uint
    }
)

;;(list 6 {min: uint, max: uint})
(define-constant limits
    (list
        {min: u0, max: u10, pos: u0}
        {min: u10, max: u66, pos: u1}
        {min: u66, max: u130, pos: u2}
        {min: u130, max: u190, pos: u3}
        {min: u190, max: u248, pos: u4}
        {min: u248, max: u256, pos: u5}
    )
)

(define-constant LEVELS
    (list
        {min: u0, max: u3}
        {min: u3, max: u10}
        {min: u10, max: u16}
        {min: u16, max: u22}
        {min: u22, max: u29}
        {min: u29, max: u32}
    )
)

(define-constant TYPES
    (list
        "Person"
        "Animal"
        "Robot"
        "Creature"
    )
)

;; (define-map custom-card-attributes {token-id: uint}
;;     {
;;         name: (string-ascii 32),
;;         strength: uint,
;;         dexterity: uint,
;;         constitution: uint,
;;         wisdom: uint,
;;         charisma: uint,
;;     }
;; )

(define-data-var last-id uint u0)

(define-read-only (get-last-token-id)
    (ok (var-get last-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok (some "sftp:hello"))
)

(define-read-only (get-owner (token-id uint))
    (ok (some tx-sender))
)

(define-read-only (get-token-attributes (token-id uint))
    (map-get? fixed-card-attributes token-id)
)

(define-public (transfer (token-id uint) (from principal) (to principal))
    (if (is-eq tx-sender to)
        (match (nft-transfer? card token-id from to)
            success (ok success)
            error (err error)
        )
        (err u500)
    )
)

(define-public (mint)
    (let (
        (type (get-card-type))
        (level (unwrap! (get-card-level) (err u333)))
        (n-skills (get-n-skills))
        )
        (asserts! (> MINT_LIMIT (var-get last-id)) (err u501))
        (match (stx-transfer? (var-get MINT_COST) tx-sender CONTRACT_DEPLOYER)
            success (match (nft-mint? card (var-get last-id) tx-sender)
                        success_ (begin
                                (map-set fixed-card-attributes (var-get last-id) 
                                    {
                                        type: type,
                                        level: level,
                                        n-skills: n-skills,
                                    }
                                )
                                (ok (var-set last-id (+ u1 (var-get last-id))))
                            )
                        error (err error)
                    )
            failure (err failure)
        )
    )
)



(define-read-only (get-card-type)
    (unwrap-panic (element-at TYPES (mod (var-get last-id) u4)))
)

(define-read-only (get-n-skills)
    (+ u1 (mod (var-get block-height-rand) u4))
)

(define-read-only (get-level (min uint) (max uint) (pos uint))
    (let ((level-limit (unwrap-panic (element-at LEVELS pos))))
        (+ (* u100 (get min level-limit))
            (*
                (/ (* u100 (- (var-get block-height-rand) min)) (- max min))
                (- (get max level-limit) (get min level-limit))
            )
        )
    )
)

(define-public (get-card-level)
    (begin
        (var-set block-height-rand (get-random-val))
        (let (
                (limit (get-edges))
                (level (get-level
                    (get min (unwrap-panic (element-at limit u0)))
                    (get max (unwrap-panic (element-at limit u0)))
                    (get pos (unwrap-panic (element-at limit u0)))
                    )
                )
            )
            (var-set card-pos (mod (+ u1 (var-get last-id)) u64))
            (ok (+ u1 (/ level u100)))
        )
    )
)
(define-read-only (get-random-val)
    (let ((seed (sha512 (unwrap-panic (get-block-info? vrf-seed (- block-height u1))))))
        (unwrap-panic (index-of BUFF_TO_BYTE (unwrap-panic (element-at seed (var-get card-pos)))))
    )
)
(define-read-only (get-edges)
    (filter seed-is-inside limits)
)
(define-read-only (seed-is-inside (limit {min: uint, max: uint, pos: uint}))
    (is-inside-edges (get min limit) (get max limit) (var-get block-height-rand))
)

(define-read-only (get-block-height-rand)
    (var-get block-height-rand)
)


;; DUMMY TESTING PLACE
(define-data-var dummy-test-val uint u0)
(define-public (dummy-set-val (new-val uint))
    (ok (var-set dummy-test-val new-val))
)
(define-public (dummy-get-level (new-val uint))
    (begin
        (var-set dummy-test-val new-val)
        (let ((limit (get-edges)))
            (var-set card-pos (+ u1 (var-get card-pos)))
            (ok limit)
        )
    )
)
(define-read-only (dummy-get-edges)
    (filter dummy-is-inside limits)
)
(define-read-only (dummy-is-inside (limit {min: uint, max: uint, pos: uint}))
    (is-inside-edges (get min limit) (get max limit) (var-get dummy-test-val))
)
;; DUMMY TESTING PLACE


(define-read-only (is-inside-edges (min uint) (max uint) (value uint))
    (and (>= value min) (< value max))
)

(define-constant BUFF_TO_BYTE (list
    0x00 0x01 0x02 0x03 0x04 0x05 0x06 0x07 0x08 0x09 0x0a 0x0b 0x0c 0x0d 0x0e 0x0f
    0x10 0x11 0x12 0x13 0x14 0x15 0x16 0x17 0x18 0x19 0x1a 0x1b 0x1c 0x1d 0x1e 0x1f 
    0x20 0x21 0x22 0x23 0x24 0x25 0x26 0x27 0x28 0x29 0x2a 0x2b 0x2c 0x2d 0x2e 0x2f
    0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39 0x3a 0x3b 0x3c 0x3d 0x3e 0x3f
    0x40 0x41 0x42 0x43 0x44 0x45 0x46 0x47 0x48 0x49 0x4a 0x4b 0x4c 0x4d 0x4e 0x4f
    0x50 0x51 0x52 0x53 0x54 0x55 0x56 0x57 0x58 0x59 0x5a 0x5b 0x5c 0x5d 0x5e 0x5f 
    0x60 0x61 0x62 0x63 0x64 0x65 0x66 0x67 0x68 0x69 0x6a 0x6b 0x6c 0x6d 0x6e 0x6f
    0x70 0x71 0x72 0x73 0x74 0x75 0x76 0x77 0x78 0x79 0x7a 0x7b 0x7c 0x7d 0x7e 0x7f
    0x80 0x81 0x82 0x83 0x84 0x85 0x86 0x87 0x88 0x89 0x8a 0x8b 0x8c 0x8d 0x8e 0x8f
    0x90 0x91 0x92 0x93 0x94 0x95 0x96 0x97 0x98 0x99 0x9a 0x9b 0x9c 0x9d 0x9e 0x9f
    0xa0 0xa1 0xa2 0xa3 0xa4 0xa5 0xa6 0xa7 0xa8 0xa9 0xaa 0xab 0xac 0xad 0xae 0xaf
    0xb0 0xb1 0xb2 0xb3 0xb4 0xb5 0xb6 0xb7 0xb8 0xb9 0xba 0xbb 0xbc 0xbd 0xbe 0xbf 
    0xc0 0xc1 0xc2 0xc3 0xc4 0xc5 0xc6 0xc7 0xc8 0xc9 0xca 0xcb 0xcc 0xcd 0xce 0xcf 
    0xd0 0xd1 0xd2 0xd3 0xd4 0xd5 0xd6 0xd7 0xd8 0xd9 0xda 0xdb 0xdc 0xdd 0xde 0xdf 
    0xe0 0xe1 0xe2 0xe3 0xe4 0xe5 0xe6 0xe7 0xe8 0xe9 0xea 0xeb 0xec 0xed 0xee 0xef
    0xf0 0xf1 0xf2 0xf3 0xf4 0xf5 0xf6 0xf7 0xf8 0xf9 0xfa 0xfb 0xfc 0xfd 0xfe 0xff
))


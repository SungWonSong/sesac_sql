// 선수와 관련된 라우터를 정의하는 파일

// 기본 요청 경로
// localhost: PORT/players

const express = require('express');
const router = express.Router();
const controller = require('../controller/Cplayer');

router.get('/', controller.getPlayers);
router.get('/:player_id', controller.getPlayer);
router.post('/', controller.postPlayer);
router.patch('/:player_id/team', controller.patchPlayer);
router.delete('/:player_id', controller.deletePlayer);

module.exports = router;
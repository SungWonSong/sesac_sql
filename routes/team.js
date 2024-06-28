// 팀과 관련된 라우터를 정의하는 파일

// 기본 요청 경로: localhost:PORT/teams

const express = require('express');
const router = express.Router();
const controller = require('../controller/Cteam');

router.get('/', controller.getTeams);
router.get('/:team_id', controller.getTeam);
router.get('/:team_id/players', controller.getTeamPlayers);

module.exports = router;
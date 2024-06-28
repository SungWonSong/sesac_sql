const { resolveInclude } = require('ejs');
const { Team, Player } = require('../models/index');
const { Op } = require('sequelize');

exports.getTeams = async (req, res) => {
    try {
        const { sort, search } = req.query; 
        console.log(req.query); // { sort: 'name_asc' }, { search: 'KT' }

        let teams;

        if (sort === 'name_asc') {
            // 이름 기준 오름차순 
            // SELECT `team_id`, `name` FROM `Team` AS `Team` ORDER BY `Team`.`name` ASC;
            teams = await Team.findAll({
                attributes: ['team_id', 'name'],
                order: [['name', 'ASC']]
            });
        } else if (search) {
            // SELECT `team_id`, `name` FROM `Team` AS `Team` WHERE `Team`.`name` LIKE '%KT%';
            teams = await Team.findAll({
                attributes: ['team_id', 'name'],
                where: {
                    name: { [Op.like]: `%${search}%`}
                }
            })
        } else {
            // 전체 조회 
            // SELECT `team_id`, `name` FROM `Team` AS `Team`;
            teams = await Team.findAll({
                attributes: ['team_id', 'name'],
            });
        }

        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getTeam = async (req, res) => {
    try {
        console.log(req.params.team_id)
        const { team_id } = req.params;

        // select * from player where player_id = 1
        const team = await Team.findOne({
            where: { team_id }, // { player_id: player_id }
        });

        res.json(team); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getTeamPlayers = async (req, res) => {
    try {
        const {team_id} = req.params;
        const team = await Team.findOne({
            where: {team_id},
            include: [ { model: Player
            }]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
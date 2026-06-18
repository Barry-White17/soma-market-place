import Shop from '../models/shop.model.js'
import lodash from 'lodash'
import errorHandler from './../helpers/dbErrorHandler.js'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { firstValues } from 'formidable/src/helpers/firstValues.js'

const create = (req, res) => {
    let form = new IncomingForm({
        keepExtensions: true,
    })
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: 'Image could not be uploaded',
            })
        }
        const originalValues = firstValues(form, fields)
        let shop = new Shop(originalValues)
        shop.owner = req.profile
        if (files.image) {
            shop.image.data = fs.readFileSync(files.image[0].filepath)
            shop.image.contentType = files.image[0].mimetype
        }
        try {
            let result = await shop.save()
            res.status(200).json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err),
            })
        }
    })
}

const shopByID = async (req, res, next, id) => {
    try {
        let shop = await Shop.findById(id).populate('owner', '_id name').exec()
        if (!shop)
            return res.status('400').json({
                error: 'Shop not found',
            })
        req.shop = shop
        next()
    } catch (err) {
        return res.status('400').json({
            error: 'Could not retrieve shop',
        })
    }
}

const photo = (req, res, next) => {
    if (req.shop.image.data) {
        res.set('Content-Type', req.shop.image.contentType)
        return res.send(req.shop.image.data)
    }
    next()
}

const read = (req, res) => {
    req.shop.image = undefined
    return res.json(req.shop)
}

const update = (req, res) => {
    let form = new IncomingForm({ keepExtensions: true })
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: 'Photo could not be uploaded',
            })
        }
        let shop = req.shop
        const originalValues = firstValues(form, fields)
        shop = lodash.extend(shop, originalValues)
        shop.updated = Date.now()
        if (files.image) {
            shop.image.data = fs.readFileSync(files.image[0].filepath)
            shop.image.contentType = files.image[0].mimetype
        }
        try {
            let result = await shop.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err),
            })
        }
    })
}

const remove = async (req, res) => {
    try {
        let shop = req.shop
        let deletedShop = shop.deleteOne()
        res.json(deletedShop)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        })
    }
}

const list = async (req, res) => {
    try {
        let shops = await Shop.find()
        res.json(shops)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        })
    }
}

const listByOwner = async (req, res) => {
    try {
        let shops = await Shop.find({ owner: req.profile._id }).populate(
            'owner',
            '_id name',
        )
        res.json(shops)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        })
    }
}

const isOwner = (req, res, next) => {
    const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id
    if (!isOwner) {
        return res.status('403').json({
            error: 'User is not authorized',
        })
    }
    next()
}

export default {
    create,
    shopByID,
    photo,
    list,
    listByOwner,
    read,
    update,
    isOwner,
    remove,
}

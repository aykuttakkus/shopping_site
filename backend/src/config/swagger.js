const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Renart Takı API',
      version: '1.0.0',
      description: 'Takı ürün listeleme ve yönetim API\'si',
      contact: {
        name: 'Aykut Akkuş',
        email: 'aykutakkus@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Ürün ID\'si'
            },
            name: {
              type: 'string',
              description: 'Ürün adı'
            },
            popularityScore: {
              type: 'number',
              format: 'float',
              description: 'Popülerlik skoru (0-1 arası)'
            },
            weight: {
              type: 'number',
              format: 'float',
              description: 'Ağırlık (gram)'
            },
            images: {
              type: 'object',
              properties: {
                yellow: {
                  type: 'string',
                  format: 'url',
                  description: 'Sarı altın görseli'
                },
                rose: {
                  type: 'string',
                  format: 'url',
                  description: 'Rose gold görseli'
                },
                white: {
                  type: 'string',
                  format: 'url',
                  description: 'Beyaz altın görseli'
                }
              }
            },
            calculatedPrice: {
              type: 'number',
              format: 'float',
              description: 'Hesaplanmış fiyat (USD)'
            },
            popularityRating: {
              type: 'number',
              format: 'float',
              description: '5 puanlık sistemde popülerlik'
            },
            goldPrice: {
              type: 'number',
              format: 'float',
              description: 'Altın fiyatı (USD/gram)'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'İşlem başarı durumu'
            },
            data: {
              type: 'object',
              description: 'Ana veri'
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'integer' },
                totalPages: { type: 'integer' },
                totalItems: { type: 'integer' },
                itemsPerPage: { type: 'integer' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' }
              }
            },
            filters: {
              type: 'object',
              description: 'Uygulanan filtreler'
            },
            sort: {
              type: 'object',
              properties: {
                sortBy: { type: 'string' },
                sortOrder: { type: 'string', enum: ['asc', 'desc'] }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Hata kodu'
                },
                message: {
                  type: 'string',
                  description: 'Hata mesajı'
                },
                details: {
                  type: 'string',
                  description: 'Detaylı hata bilgisi'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = specs;

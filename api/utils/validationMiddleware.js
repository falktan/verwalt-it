/**
 * Validation middleware factory
 * Creates an Express middleware that validates the request body against a Yup schema
 * 
 * @param {Object} schema - Yup validation schema
 * @returns {Function} Express middleware function
 */
export function validateRequest(schema) {
  return async (req, res, next) => {
    try {
      // Validate and transform the request body
      // abortEarly: false - collect all validation errors
      // stripUnknown: true - remove unknown fields from the validated data
      const validatedData = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      // Replace req.body with validated and sanitized data
      req.body = validatedData;
      next();
    } catch (error) {
      // Yup ValidationError
      if (error.name === 'ValidationError') {
        // Format validation errors for better readability
        const errorDetails = error.inner.map(err => ({
          field: err.path,
          message: err.message
        }));

        return res.status(400).json({
          error: 'Validation Error',
          message: 'Die gesendeten Daten sind ungültig',
          details: errorDetails
        });
      }

      // Other errors
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ein unerwarteter Fehler ist aufgetreten'
      });
    }
  };
}


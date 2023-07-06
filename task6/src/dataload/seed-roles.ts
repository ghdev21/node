import {RoleModel} from '../role/Role.model';

export const seedRoles = async (): Promise<void> => {
	try {
		const roles = ['admin', 'user'];
		for (const role of roles ) {
			const roleEntity = await RoleModel.findOne({ role });
			if (!roleEntity) {
				await RoleModel.create({role});
			}
		}
	} catch (error) {
		console.error('Error seeding products', error);
	}
};

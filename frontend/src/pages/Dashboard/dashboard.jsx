import { ShoppingCartIcon, CreditCardIcon, UserIcon, UsersIcon, ArrowRightIcon } from '@heroicons/react/16/solid';
import { Link } from 'react-router-dom';  // Import Link

const Dashboard = () => {
    
    return (
        <div className="px-8">
            <div className="w-full text-center mb-8">
                <p className="text-2xl font-semibold">Quick Stats</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Container 1 */}
                <div className="h-56 w-full rounded-lg bg-white shadow-lg flex flex-col justify-between">
                    <div className="px-6 pt-6 text-md font-semibold">
                        Container 1
                    </div>
                    <div className="flex flex-row justify-between px-6">
                        <div className="relative h-14 w-14 rounded-full bg-neutral-800 text-center text-pink-50">
                            <ShoppingCartIcon className="h-8 w-8 mx-auto my-3 text-white" />
                        </div>
                        <h2 className="self-center text-3xl font-bold">1</h2>
                    </div>
                    <div className="px-6 pb-6">
                        <Link
                            className="text-md flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition duration-200"
                            to="/OverallInventory"
                        >
                            <span>View more</span>
                            <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Container 2 */}
                <div className="h-56 w-full rounded-lg bg-white shadow-lg flex flex-col justify-between">
                    <div className="px-6 pt-6 text-md font-semibold">Container 2</div>
                    <div className="flex flex-row justify-between px-6">
                        <div className="relative h-14 w-14 rounded-full bg-neutral-800 text-center text-yellow-50">
                            <CreditCardIcon className="h-8 w-8 mx-auto my-3 text-white" />
                        </div>
                        <h2 className="self-center text-3xl font-bold">2</h2>
                    </div>
                    <div className="px-6 pb-6">
                        <Link
                            className="text-md flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition duration-200" to="/patients">
                            <span>View more</span>
                            <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Container 3 */}
                <div className="h-56 w-full rounded-lg bg-white shadow-lg flex flex-col justify-between">
                    <div className="px-6 pt-6 text-md font-semibold">Container 3</div>
                    <div className="flex flex-row justify-between px-6">
                        <div className="relative h-14 w-14 rounded-full bg-neutral-800 text-center text-green-50">
                            <UserIcon className="h-8 w-8 mx-auto my-3 text-white" />
                        </div>
                        <h2 className="self-center text-3xl font-bold">3</h2>
                    </div>
                    <div className="px-6 pb-6">
                        <a className="text-md flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition duration-200" href="#">
                            <span>View more</span>
                            <ArrowRightIcon className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                {/* Container 4 */}
                <div className="h-56 w-full rounded-lg bg-white shadow-lg flex flex-col justify-between">
                    <div className="px-6 pt-6 text-md font-semibold">Container 4</div>
                    <div className="flex flex-row justify-between px-6">
                        <div className="relative h-14 w-14 rounded-full bg-neutral-800 text-center text-indigo-50">
                            <UsersIcon className="h-8 w-8 mx-auto my-3 text-white" />
                        </div>
                        <h2 className="self-center text-3xl font-bold">4</h2>
                    </div>
                    <div className="px-6 pb-6">
                        <a className="text-md flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition duration-200" href="#">
                            <span>View more</span>
                            <ArrowRightIcon className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;